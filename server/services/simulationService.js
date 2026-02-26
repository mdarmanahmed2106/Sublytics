const Subscription = require('../models/Subscription');
const { toMonthlyCost } = require('./subscriptionService');
const healthScoreService = require('./healthScoreService');

/**
 * Simulate cancelling a subscription without mutating the DB.
 * Returns projected improvements in health score and spend.
 */
const simulate = async (userId, subscriptionId) => {
    const allSubs = await Subscription.find({ userId });
    const targetSub = allSubs.find((s) => s._id.toString() === subscriptionId);

    if (!targetSub) {
        return { error: 'Subscription not found' };
    }

    const activeSubs = allSubs.filter((s) => s.status === 'active');
    const monthlyCostRemoved = toMonthlyCost(targetSub.cost, targetSub.billingInterval);

    // Current metrics
    const currentMonthly = activeSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);
    const currentHealthResult = await healthScoreService.calculate(userId, { subscriptions: allSubs });

    // Simulated: remove the target subscription from active list
    const simulatedSubs = allSubs.filter((s) => s._id.toString() !== subscriptionId);
    const newHealthResult = await healthScoreService.calculate(userId, { subscriptions: simulatedSubs });

    const newMonthly = currentMonthly - monthlyCostRemoved;
    const monthlySavings = Math.round(monthlyCostRemoved * 100) / 100;
    const annualSavings = Math.round(monthlyCostRemoved * 12 * 100) / 100;

    // Category concentration change
    const currentCategoryBreakdown = buildCategoryBreakdown(activeSubs);
    const simulatedActive = simulatedSubs.filter((s) => s.status === 'active');
    const newCategoryBreakdown = buildCategoryBreakdown(simulatedActive);

    return {
        subscription: {
            name: targetSub.name,
            category: targetSub.category,
            monthlyCost: monthlyCostRemoved,
        },
        current: {
            healthScore: currentHealthResult.score,
            grade: currentHealthResult.grade,
            monthlySpend: Math.round(currentMonthly * 100) / 100,
            categoryBreakdown: currentCategoryBreakdown,
        },
        projected: {
            healthScore: newHealthResult.score,
            grade: newHealthResult.grade,
            monthlySpend: Math.round(newMonthly * 100) / 100,
            categoryBreakdown: newCategoryBreakdown,
        },
        improvement: newHealthResult.score - currentHealthResult.score,
        monthlySavings,
        annualSavings,
    };
};

/**
 * Build a category breakdown array from subscriptions.
 */
function buildCategoryBreakdown(subs) {
    const categorySpend = {};
    const totalMonthly = subs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);

    subs.forEach((s) => {
        const monthly = toMonthlyCost(s.cost, s.billingInterval);
        categorySpend[s.category] = (categorySpend[s.category] || 0) + monthly;
    });

    return Object.entries(categorySpend)
        .map(([category, spend]) => ({
            category,
            spend: Math.round(spend * 100) / 100,
            percentage: totalMonthly > 0 ? Math.round((spend / totalMonthly) * 10000) / 100 : 0,
        }))
        .sort((a, b) => b.spend - a.spend);
}

module.exports = { simulate };
