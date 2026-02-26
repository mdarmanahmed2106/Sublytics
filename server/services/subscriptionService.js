const Subscription = require('../models/Subscription');
const ActivityLog = require('../models/ActivityLog');
const AppError = require('../utils/AppError');

/**
 * Normalize billingInterval to monthly cost.
 */
const toMonthlyCost = (cost, interval) => {
    if (!interval) return cost;
    const { value, unit } = interval;
    switch (unit) {
        case 'day': return (cost / value) * 30;
        case 'week': return (cost / value) * (30 / 7);
        case 'month': return cost / value;
        case 'year': return cost / (value * 12);
        default: return cost;
    }
};

const list = async (userId, query) => {
    const { search, category, status, minCost, maxCost, sort, order } = query;
    const filter = { userId };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minCost || maxCost) {
        filter.cost = {};
        if (minCost) filter.cost.$gte = parseFloat(minCost);
        if (maxCost) filter.cost.$lte = parseFloat(maxCost);
    }

    const sortField = sort || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const subs = await Subscription.find(filter).sort({ [sortField]: sortOrder });

    // Attach behavioral tags
    const allActive = subs.filter((s) => s.status === 'active');
    return subs.map((s) => {
        const obj = s.toObject();
        obj.behavioralTag = computeBehavioralTag(s, allActive);
        return obj;
    });
};

const getById = async (userId, id) => {
    const subscription = await Subscription.findOne({ _id: id, userId });
    if (!subscription) throw new AppError('Subscription not found', 404, 'NOT_FOUND');

    // Attach behavioral tag
    const allActive = await Subscription.find({ userId, status: 'active' });
    const obj = subscription.toObject();
    obj.behavioralTag = computeBehavioralTag(subscription, allActive);
    return obj;
};

const create = async (userId, data) => {
    const subscription = await Subscription.create({ ...data, userId });

    await ActivityLog.create({
        userId,
        entityId: subscription._id,
        action: 'created',
        changes: { subscription: data },
    });

    return subscription;
};

const update = async (userId, id, data) => {
    const subscription = await Subscription.findOne({ _id: id, userId });
    if (!subscription) throw new AppError('Subscription not found', 404, 'NOT_FOUND');

    // Track changes
    const changes = {};
    Object.keys(data).forEach((key) => {
        if (String(subscription[key]) !== String(data[key])) {
            changes[key] = { from: subscription[key], to: data[key] };
        }
    });

    // Use set + save to trigger pre-save hooks (nextBillingDate calc)
    Object.assign(subscription, data);
    await subscription.save();

    await ActivityLog.create({
        userId,
        entityId: subscription._id,
        action: 'updated',
        changes,
    });

    return subscription;
};

const remove = async (userId, id) => {
    const subscription = await Subscription.findOne({ _id: id, userId });
    if (!subscription) throw new AppError('Subscription not found', 404, 'NOT_FOUND');

    await ActivityLog.create({
        userId,
        entityId: subscription._id,
        action: 'deleted',
        changes: { deletedSubscription: subscription.toObject() },
    });

    await Subscription.findByIdAndDelete(id);
};

/**
 * Mark a subscription as recently used (updates lastUsedAt).
 */
const markAsUsed = async (userId, id) => {
    const subscription = await Subscription.findOne({ _id: id, userId });
    if (!subscription) throw new AppError('Subscription not found', 404, 'NOT_FOUND');
    subscription.lastUsedAt = new Date();
    await subscription.save();
    return subscription;
};

// ── Behavioral Tagging ──

/**
 * Compute a behavioral tag for a subscription.
 * Tags: 'waste-risk', 'review', 'healthy'
 */
function computeBehavioralTag(subscription, allActiveSubs) {
    if (subscription.status !== 'active') return 'inactive';

    const now = new Date();

    // Rule 1: waste-risk — unused for 60+ days
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    if (!subscription.lastUsedAt || subscription.lastUsedAt < sixtyDaysAgo) {
        return 'waste-risk';
    }

    // Rule 2: review — renewal within 7 days
    if (subscription.nextBillingDate) {
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (subscription.nextBillingDate >= now && subscription.nextBillingDate <= sevenDaysFromNow) {
            return 'review';
        }
    }

    // Rule 3: review — category concentration >40%
    if (allActiveSubs.length > 1) {
        const totalMonthly = allActiveSubs.reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);
        const categoryMonthly = allActiveSubs
            .filter((s) => s.category === subscription.category)
            .reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billingInterval), 0);
        if (totalMonthly > 0 && categoryMonthly / totalMonthly > 0.40) {
            return 'review';
        }
    }

    return 'healthy';
}

module.exports = { list, getById, create, update, remove, toMonthlyCost, markAsUsed, computeBehavioralTag };
