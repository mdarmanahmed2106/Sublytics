const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { toMonthlyCost } = require('./subscriptionService');

// ── Configurable deduction rules ──
const RULES = {
    incomeRatio: {
        thresholds: [
            { pct: 0.50, deduction: 25, label: 'extreme' },
            { pct: 0.30, deduction: 15, label: 'very high' },
            { pct: 0.20, deduction: 10, label: 'high' },
            { pct: 0.10, deduction: 5, label: 'moderate' },
        ],
    },
    duplicateCategory: { deductionPer: 5 },
    spendingSpike: {
        thresholds: [
            { pct: 30, deduction: 15, severity: 'high' },
            { pct: 20, deduction: 10, severity: 'medium' },
            { pct: 15, deduction: 5, severity: 'low' },
        ],
    },
    unusedSubscription: { deductionPer: 8, daysThreshold: 60 },
    imminentRenewal: { deductionPer: 3, daysThreshold: 3 },
    categoryConcentration: { deduction: 10, threshold: 0.50 },
};

const GRADES = [
    { min: 90, grade: 'Excellent' },
    { min: 75, grade: 'Good' },
    { min: 50, grade: 'Moderate' },
    { min: 0, grade: 'Poor' },
];

/**
 * Calculate health score for a user.
 * Can accept pre-fetched subscriptions (for simulation) or fetch from DB.
 */
const calculate = async (userId, { subscriptions: prefetched } = {}) => {
    let score = 100;
    const factors = [];

    const subs = prefetched || await Subscription.find({ userId });
    const activeSubs = subs.filter((s) => s.status === 'active');

    if (activeSubs.length === 0) {
        return { score: 100, grade: 'Excellent', factors: ['No active subscriptions to evaluate'] };
    }

    const totalMonthly = activeSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);

    // ── Rule 1: Spend-to-income ratio ──
    if (!prefetched) {
        const user = await User.findById(userId).select('monthlyIncome');
        if (user?.monthlyIncome && user.monthlyIncome > 0) {
            const ratio = totalMonthly / user.monthlyIncome;
            for (const t of RULES.incomeRatio.thresholds) {
                if (ratio >= t.pct) {
                    score -= t.deduction;
                    factors.push(`Subscriptions consume ${(ratio * 100).toFixed(0)}% of income (${t.label})`);
                    break;
                }
            }
        }
    }

    // ── Rule 2: Duplicate categories ──
    const categoryCounts = {};
    activeSubs.forEach((s) => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1; });
    const duplicates = Object.entries(categoryCounts).filter(([, count]) => count >= 2);
    if (duplicates.length > 0) {
        const ded = duplicates.length * RULES.duplicateCategory.deductionPer;
        score -= ded;
        duplicates.forEach(([cat, count]) => {
            factors.push(`${count} subscriptions in ${cat} category`);
        });
    }

    // ── Rule 3: Spending spike ──
    const spikeResult = computeSpike(subs);
    if (spikeResult && spikeResult.trend === 'increase') {
        for (const t of RULES.spendingSpike.thresholds) {
            if (spikeResult.percentage >= t.pct) {
                score -= t.deduction;
                factors.push(`Spending spike detected: +${spikeResult.percentage.toFixed(0)}% vs average`);
                break;
            }
        }
    }

    // ── Rule 4: Unused subscriptions ──
    const now = new Date();
    const unusedThreshold = new Date(now.getTime() - RULES.unusedSubscription.daysThreshold * 24 * 60 * 60 * 1000);
    const unusedSubs = activeSubs.filter(
        (s) => !s.lastUsedAt || s.lastUsedAt < unusedThreshold
    );
    if (unusedSubs.length > 0) {
        score -= unusedSubs.length * RULES.unusedSubscription.deductionPer;
        factors.push(`${unusedSubs.length} potentially unused subscription${unusedSubs.length > 1 ? 's' : ''}`);
    }

    // ── Rule 5: Imminent renewals ──
    const renewalThreshold = new Date(now.getTime() + RULES.imminentRenewal.daysThreshold * 24 * 60 * 60 * 1000);
    const imminentRenewals = activeSubs.filter(
        (s) => s.nextBillingDate && s.nextBillingDate >= now && s.nextBillingDate <= renewalThreshold
    );
    if (imminentRenewals.length > 0) {
        score -= imminentRenewals.length * RULES.imminentRenewal.deductionPer;
        const names = imminentRenewals.map((s) => s.name).join(', ');
        factors.push(`Upcoming renewal${imminentRenewals.length > 1 ? 's' : ''}: ${names}`);
    }

    // ── Rule 6: Category concentration ──
    const categorySpend = {};
    activeSubs.forEach((s) => {
        const monthly = toMonthlyCost(s.cost, s.billingInterval);
        categorySpend[s.category] = (categorySpend[s.category] || 0) + monthly;
    });
    const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && totalMonthly > 0) {
        const concentration = topCategory[1] / totalMonthly;
        if (concentration >= RULES.categoryConcentration.threshold) {
            score -= RULES.categoryConcentration.deduction;
            factors.push(`High ${topCategory[0]} concentration (${(concentration * 100).toFixed(0)}% of spend)`);
        }
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    const grade = GRADES.find((g) => score >= g.min)?.grade || 'Poor';

    return { score, grade, factors };
};

/**
 * Internal helper: compute spending spike from subscription data.
 * Groups by subscription creation month and compares current month to prev 3-month avg.
 */
function computeSpike(subs) {
    const activeSubs = subs.filter((s) => s.status === 'active');
    if (activeSubs.length === 0) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Build monthly spend map from subscriptions based on their start dates
    const monthlySpend = {};
    activeSubs.forEach((s) => {
        const monthly = toMonthlyCost(s.cost, s.billingInterval);
        const start = new Date(s.startDate);
        // This subscription contributes to every month from start to now
        const startMonth = start.getFullYear() * 12 + start.getMonth();
        const nowMonth = currentYear * 12 + currentMonth;
        for (let m = Math.max(startMonth, nowMonth - 5); m <= nowMonth; m++) {
            const key = `${Math.floor(m / 12)}-${m % 12}`;
            monthlySpend[key] = (monthlySpend[key] || 0) + monthly;
        }
    });

    const currentKey = `${currentYear}-${currentMonth}`;
    const currentSpend = monthlySpend[currentKey] || 0;

    // Get previous 3 months
    const prevMonths = [];
    for (let i = 1; i <= 3; i++) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthlySpend[key] !== undefined) {
            prevMonths.push(monthlySpend[key]);
        }
    }

    if (prevMonths.length === 0) return null;

    const avgPrev = prevMonths.reduce((a, b) => a + b, 0) / prevMonths.length;
    if (avgPrev === 0) return null;

    const pctChange = ((currentSpend - avgPrev) / avgPrev) * 100;

    if (pctChange > 15) {
        let severity = 'low';
        if (pctChange > 30) severity = 'high';
        else if (pctChange > 20) severity = 'medium';
        return {
            trend: 'increase',
            percentage: Math.round(pctChange * 100) / 100,
            severity,
            currentMonth: Math.round(currentSpend * 100) / 100,
            averagePrevious: Math.round(avgPrev * 100) / 100,
        };
    }

    if (pctChange < -15) {
        return {
            trend: 'decrease',
            percentage: Math.round(Math.abs(pctChange) * 100) / 100,
            severity: 'positive',
            currentMonth: Math.round(currentSpend * 100) / 100,
            averagePrevious: Math.round(avgPrev * 100) / 100,
        };
    }

    return {
        trend: 'stable',
        percentage: Math.round(pctChange * 100) / 100,
        severity: 'none',
        currentMonth: Math.round(currentSpend * 100) / 100,
        averagePrevious: Math.round(avgPrev * 100) / 100,
    };
}

module.exports = { calculate, RULES };
