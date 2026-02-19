const Subscription = require('../models/Subscription');

// @desc    Get analytics summary (total monthly/annual cost, counts by status)
// @route   GET /api/analytics/summary
const getSummary = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            userId: req.user._id,
            status: 'active',
        });

        let totalMonthly = 0;
        subscriptions.forEach((sub) => {
            switch (sub.billingCycle) {
                case 'monthly':
                    totalMonthly += sub.cost;
                    break;
                case 'quarterly':
                    totalMonthly += sub.cost / 3;
                    break;
                case 'annually':
                    totalMonthly += sub.cost / 12;
                    break;
                default:
                    totalMonthly += sub.cost;
            }
        });

        const totalAnnual = totalMonthly * 12;

        // Status counts
        const allSubs = await Subscription.find({ userId: req.user._id });
        const statusCounts = { active: 0, paused: 0, cancelled: 0 };
        allSubs.forEach((sub) => {
            statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1;
        });

        const avgCost = subscriptions.length > 0 ? totalMonthly / subscriptions.length : 0;

        // Most expensive
        const mostExpensive = subscriptions.sort((a, b) => b.cost - a.cost)[0] || null;

        res.json({
            success: true,
            data: {
                totalMonthly: Math.round(totalMonthly * 100) / 100,
                totalAnnual: Math.round(totalAnnual * 100) / 100,
                totalSubscriptions: allSubs.length,
                activeCount: statusCounts.active,
                pausedCount: statusCounts.paused,
                cancelledCount: statusCounts.cancelled,
                avgCostPerSub: Math.round(avgCost * 100) / 100,
                mostExpensive: mostExpensive
                    ? { name: mostExpensive.name, cost: mostExpensive.cost, category: mostExpensive.category }
                    : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching analytics summary' },
        });
    }
};

// @desc    Get spending by category
// @route   GET /api/analytics/by-category
const getByCategory = async (req, res) => {
    try {
        const result = await Subscription.aggregate([
            { $match: { userId: req.user._id, status: 'active' } },
            {
                $group: {
                    _id: '$category',
                    totalCost: { $sum: '$cost' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { totalCost: -1 } },
        ]);

        const data = result.map((item) => ({
            category: item._id,
            totalCost: Math.round(item.totalCost * 100) / 100,
            count: item.count,
        }));

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching category analytics' },
        });
    }
};

// @desc    Get spending trend over months
// @route   GET /api/analytics/trend
const getTrend = async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 6;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const result = await Subscription.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    startDate: { $lte: new Date() },
                    status: { $in: ['active', 'paused'] },
                },
            },
            {
                $project: {
                    cost: 1,
                    billingCycle: 1,
                    monthlyCost: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$billingCycle', 'monthly'] }, then: '$cost' },
                                { case: { $eq: ['$billingCycle', 'quarterly'] }, then: { $divide: ['$cost', 3] } },
                                { case: { $eq: ['$billingCycle', 'annually'] }, then: { $divide: ['$cost', 12] } },
                            ],
                            default: '$cost',
                        },
                    },
                },
            },
        ]);

        // Build trend data (simplified — shows cumulative monthly cost over past N months)
        const trendData = [];
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            const totalMonthly = result.reduce((sum, s) => sum + (s.monthlyCost || 0), 0);
            trendData.push({
                month: monthLabel,
                total: Math.round(totalMonthly * 100) / 100,
            });
        }

        res.json({ success: true, data: trendData });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching spending trend' },
        });
    }
};

// @desc    Get auto-generated insights
// @route   GET /api/analytics/insights
const getInsights = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id });
        const insights = [];

        const activeCount = subscriptions.filter((s) => s.status === 'active').length;
        const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
        const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length;

        if (pausedCount > 0) {
            insights.push({
                type: 'warning',
                message: `You have ${pausedCount} paused subscription${pausedCount > 1 ? 's' : ''}. Consider cancelling if no longer needed.`,
            });
        }

        if (activeCount > 5) {
            insights.push({
                type: 'info',
                message: `You have ${activeCount} active subscriptions. Review them to find potential savings.`,
            });
        }

        // Find most expensive category
        const categorySpend = {};
        subscriptions
            .filter((s) => s.status === 'active')
            .forEach((s) => {
                categorySpend[s.category] = (categorySpend[s.category] || 0) + s.cost;
            });

        const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];
        if (topCategory) {
            insights.push({
                type: 'info',
                message: `${topCategory[0]} is your highest spending category at ₹${topCategory[1].toFixed(2)}/cycle.`,
            });
        }

        if (cancelledCount > 0) {
            insights.push({
                type: 'success',
                message: `You've cancelled ${cancelledCount} subscription${cancelledCount > 1 ? 's' : ''}. Great job managing your expenses!`,
            });
        }

        if (subscriptions.length === 0) {
            insights.push({
                type: 'info',
                message: 'Add your first subscription to start tracking your expenses!',
            });
        }

        res.json({ success: true, data: insights });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error generating insights' },
        });
    }
};

module.exports = { getSummary, getByCategory, getTrend, getInsights };
