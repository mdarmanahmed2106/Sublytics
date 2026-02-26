const Subscription = require('../models/Subscription');
const { toMonthlyCost } = require('./subscriptionService');

const getSummary = async (userId) => {
    const allSubs = await Subscription.find({ userId });
    const activeSubs = allSubs.filter((s) => s.status === 'active');

    let totalMonthly = 0;
    activeSubs.forEach((sub) => {
        totalMonthly += toMonthlyCost(sub.cost, sub.billingInterval);
    });

    const totalAnnual = totalMonthly * 12;
    const statusCounts = { active: 0, paused: 0, cancelled: 0 };
    allSubs.forEach((sub) => { statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1; });
    const avgCost = activeSubs.length > 0 ? totalMonthly / activeSubs.length : 0;
    const mostExpensive = [...activeSubs].sort((a, b) => b.cost - a.cost)[0] || null;

    return {
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
    };
};

const getByCategory = async (userId) => {
    const result = await Subscription.aggregate([
        { $match: { userId, status: 'active' } },
        { $group: { _id: '$category', totalCost: { $sum: '$cost' }, count: { $sum: 1 } } },
        { $sort: { totalCost: -1 } },
    ]);

    return result.map((item) => ({
        category: item._id,
        totalCost: Math.round(item.totalCost * 100) / 100,
        count: item.count,
    }));
};

const getTrend = async (userId, months = 6) => {
    const subs = await Subscription.find({
        userId,
        startDate: { $lte: new Date() },
        status: { $in: ['active', 'paused'] },
    });

    const trendData = [];
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        // End of this month
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        // Only count subscriptions that had started by this month
        const activeThatMonth = subs.filter((s) => new Date(s.startDate) <= monthEnd);
        const monthTotal = activeThatMonth.reduce(
            (sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0
        );

        trendData.push({
            month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
            total: Math.round(monthTotal * 100) / 100,
        });
    }

    return trendData;
};

module.exports = { getSummary, getByCategory, getTrend };
