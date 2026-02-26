const Subscription = require('../models/Subscription');
const { toMonthlyCost } = require('./subscriptionService');

/**
 * Detect spending spike by comparing current month total with
 * the average of the previous 3 months.
 */
const detectSpike = async (userId) => {
    const subs = await Subscription.find({ userId });
    const activeSubs = subs.filter((s) => s.status === 'active');

    if (activeSubs.length === 0) {
        return { trend: 'stable', percentage: 0, severity: 'none', currentMonth: 0, averagePrevious: 0 };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Build monthly spend map:
    // Each active subscription contributes its monthly cost to every month
    // from its start date to the current month
    const monthlySpend = {};

    activeSubs.forEach((s) => {
        const monthly = toMonthlyCost(s.cost, s.billingInterval);
        const start = new Date(s.startDate);
        const startMonthIndex = start.getFullYear() * 12 + start.getMonth();
        const nowMonthIndex = currentYear * 12 + currentMonth;

        // Only compute for the last 6 months max for performance
        for (let m = Math.max(startMonthIndex, nowMonthIndex - 5); m <= nowMonthIndex; m++) {
            const yr = Math.floor(m / 12);
            const mo = m % 12;
            const key = `${yr}-${mo}`;
            monthlySpend[key] = (monthlySpend[key] || 0) + monthly;
        }
    });

    const currentKey = `${currentYear}-${currentMonth}`;
    const currentSpend = monthlySpend[currentKey] || 0;

    // Gather previous 3 months
    const prevAmounts = [];
    for (let i = 1; i <= 3; i++) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthlySpend[key] !== undefined) {
            prevAmounts.push(monthlySpend[key]);
        }
    }

    // Edge case: new user with < 1 month of history
    if (prevAmounts.length === 0) {
        return {
            trend: 'insufficient_data',
            percentage: 0,
            severity: 'none',
            currentMonth: Math.round(currentSpend * 100) / 100,
            averagePrevious: 0,
            message: 'Not enough history to detect trends. Need at least 1 previous month.',
        };
    }

    const avgPrev = prevAmounts.reduce((a, b) => a + b, 0) / prevAmounts.length;

    if (avgPrev === 0) {
        return {
            trend: currentSpend > 0 ? 'new_spending' : 'stable',
            percentage: currentSpend > 0 ? 100 : 0,
            severity: currentSpend > 0 ? 'medium' : 'none',
            currentMonth: Math.round(currentSpend * 100) / 100,
            averagePrevious: 0,
        };
    }

    const pctChange = ((currentSpend - avgPrev) / avgPrev) * 100;
    const roundedPct = Math.round(pctChange * 100) / 100;

    let trend, severity;

    if (pctChange > 30) {
        trend = 'increase';
        severity = 'high';
    } else if (pctChange > 20) {
        trend = 'increase';
        severity = 'medium';
    } else if (pctChange > 15) {
        trend = 'increase';
        severity = 'low';
    } else if (pctChange < -15) {
        trend = 'decrease';
        severity = 'positive';
    } else {
        trend = 'stable';
        severity = 'none';
    }

    return {
        trend,
        percentage: Math.abs(roundedPct),
        severity,
        currentMonth: Math.round(currentSpend * 100) / 100,
        averagePrevious: Math.round(avgPrev * 100) / 100,
    };
};

module.exports = { detectSpike };
