const Subscription = require('../models/Subscription');
const { toMonthlyCost } = require('./subscriptionService');
const { detectSpike } = require('./trendService');

/**
 * Generate structured, prioritized insights for a user.
 * Each insight has: type, title, description, impact, priority, category.
 */
const generate = async (userId) => {
    const subscriptions = await Subscription.find({ userId });
    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const insights = [];
    const now = new Date();

    if (activeSubs.length === 0) {
        insights.push({
            type: 'info',
            title: 'Get Started',
            description: 'Add your first subscription to unlock intelligent insights and spending analysis.',
            impact: null,
            priority: 'low',
            category: 'general',
        });
        return insights;
    }

    const totalMonthly = activeSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);

    // ── Build category spend map ──
    const categorySpend = {};
    const categorySubs = {};
    activeSubs.forEach((s) => {
        const monthly = toMonthlyCost(s.cost, s.billingInterval);
        categorySpend[s.category] = (categorySpend[s.category] || 0) + monthly;
        if (!categorySubs[s.category]) categorySubs[s.category] = [];
        categorySubs[s.category].push(s);
    });

    // ── Rule 1: Overspending categories (>40% concentration) ──
    Object.entries(categorySpend).forEach(([cat, spend]) => {
        const pct = totalMonthly > 0 ? (spend / totalMonthly) * 100 : 0;
        if (pct > 40) {
            insights.push({
                type: 'warning',
                title: `High ${cat} Spend`,
                description: `${cat} accounts for ${pct.toFixed(0)}% of your total monthly expenses. Consider diversifying or trimming subscriptions in this category.`,
                impact: `₹${Math.round(spend)}/month`,
                priority: 'high',
                category: 'concentration',
            });
        }
    });

    // ── Rule 2: Duplicate subscriptions in same category ──
    Object.entries(categorySubs).forEach(([cat, subs]) => {
        if (subs.length >= 2) {
            const names = subs.map((s) => s.name).join(', ');
            const totalCat = subs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);
            insights.push({
                type: 'warning',
                title: `Duplicate ${cat} Subscriptions`,
                description: `You have ${subs.length} subscriptions in ${cat}: ${names}. Consider consolidating to reduce overlap.`,
                impact: `₹${Math.round(totalCat)}/month combined`,
                priority: 'medium',
                category: 'duplicate',
            });
        }
    });

    // ── Rule 3: Inactive but active subscriptions ──
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const unusedSubs = activeSubs.filter(
        (s) => !s.lastUsedAt || s.lastUsedAt < sixtyDaysAgo
    );
    if (unusedSubs.length > 0) {
        const wasteMonthly = unusedSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);
        const wasteAnnual = wasteMonthly * 12;
        insights.push({
            type: 'danger',
            title: `${unusedSubs.length} Potentially Unused Subscription${unusedSubs.length > 1 ? 's' : ''}`,
            description: `${unusedSubs.map((s) => s.name).join(', ')} ${unusedSubs.length > 1 ? 'haven\'t' : 'hasn\'t'} been marked as used in 60+ days. Consider cancelling to save money.`,
            impact: `₹${Math.round(wasteMonthly)}/month · ₹${Math.round(wasteAnnual)}/year`,
            priority: 'high',
            category: 'unused',
        });
    }

    // ── Rule 4: Spending spike detection ──
    try {
        const spike = await detectSpike(userId);
        if (spike.trend === 'increase') {
            insights.push({
                type: 'warning',
                title: 'Spending Spike Detected',
                description: `Your subscription spending increased by ${spike.percentage.toFixed(0)}% compared to your 3-month average. Current: ₹${spike.currentMonth}, Average: ₹${spike.averagePrevious}.`,
                impact: `+${spike.percentage.toFixed(0)}%`,
                priority: spike.severity === 'high' ? 'high' : 'medium',
                category: 'trend',
            });
        } else if (spike.trend === 'decrease') {
            insights.push({
                type: 'success',
                title: 'Spending Decreased',
                description: `Great job! Your subscription spending decreased by ${spike.percentage.toFixed(0)}% compared to your 3-month average.`,
                impact: `-${spike.percentage.toFixed(0)}%`,
                priority: 'low',
                category: 'trend',
            });
        }
    } catch (err) {
        // Silently skip spike detection on error
    }

    // ── Rule 5: Imminent renewals (<=3 days) ──
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const imminentRenewals = activeSubs.filter(
        (s) => s.nextBillingDate && s.nextBillingDate >= now && s.nextBillingDate <= threeDaysFromNow
    );
    imminentRenewals.forEach((s) => {
        const daysRemaining = Math.ceil((s.nextBillingDate - now) / (24 * 60 * 60 * 1000));
        insights.push({
            type: 'renewal',
            title: 'Renewal Approaching',
            description: `${s.name} renews in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} (₹${s.cost}). Review before auto-renewal.`,
            impact: `₹${s.cost}`,
            priority: daysRemaining <= 1 ? 'high' : 'medium',
            category: 'renewal',
            meta: { subscriptionId: s._id, daysRemaining, subscriptionName: s.name },
        });
    });

    // ── Rule 6: Annual savings potential (monthly → yearly) ──
    const monthlySubs = activeSubs.filter(
        (s) => s.billingInterval?.unit === 'month' && s.billingInterval?.value === 1
    );
    if (monthlySubs.length > 0) {
        const potentialSavings = monthlySubs.reduce((sum, s) => sum + s.cost * 12 * 0.15, 0);
        if (potentialSavings > 0) {
            insights.push({
                type: 'tip',
                title: 'Switch to Annual Plans',
                description: `${monthlySubs.length} subscription${monthlySubs.length > 1 ? 's are' : ' is'} billed monthly. Switching to annual plans typically saves ~15%.`,
                impact: `~₹${Math.round(potentialSavings)}/year savings`,
                priority: 'low',
                category: 'savings',
            });
        }
    }

    // ── Rule 7: Annual waste estimate ──
    if (unusedSubs.length > 0) {
        const annualWaste = unusedSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval) * 12, 0);
        insights.push({
            type: 'danger',
            title: 'Annual Waste Estimate',
            description: `Based on ${unusedSubs.length} unused subscription${unusedSubs.length > 1 ? 's' : ''}, you're projected to waste ₹${Math.round(annualWaste)} this year on services you don't actively use.`,
            impact: `₹${Math.round(annualWaste)}/year`,
            priority: 'high',
            category: 'waste',
        });
    }

    // ── Sort by priority ──
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));

    return insights;
};

module.exports = { generate };
