const { validationResult, body } = require('express-validator');
const Subscription = require('../models/Subscription');
const ActivityLog = require('../models/ActivityLog');

// Validation rules
const subscriptionValidation = [
    body('name').trim().notEmpty().withMessage('Subscription name is required'),
    body('category')
        .isIn(['Entertainment', 'Productivity', 'Fitness', 'Finance', 'Other'])
        .withMessage('Invalid category'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('billingCycle')
        .isIn(['monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Invalid billing cycle'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
];

// @desc    Get all subscriptions for user (with search, filter, sort)
// @route   GET /api/subscriptions
const getSubscriptions = async (req, res) => {
    try {
        const { search, category, status, billingCycle, minCost, maxCost, sort, order } = req.query;
        const filter = { userId: req.user._id };

        // Text search on name and description
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (billingCycle) filter.billingCycle = billingCycle;

        // Cost range
        if (minCost || maxCost) {
            filter.cost = {};
            if (minCost) filter.cost.$gte = parseFloat(minCost);
            if (maxCost) filter.cost.$lte = parseFloat(maxCost);
        }

        // Sort
        const sortField = sort || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const subscriptions = await Subscription.find(filter).sort({ [sortField]: sortOrder });

        res.json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching subscriptions' },
        });
    }
};

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
const getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Subscription not found' },
            });
        }

        res.json({ success: true, data: subscription });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching subscription' },
        });
    }
};

// @desc    Create subscription
// @route   POST /api/subscriptions
const createSubscription = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
        });
    }

    try {
        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user._id,
        });

        // Log activity
        await ActivityLog.create({
            userId: req.user._id,
            entityId: subscription._id,
            action: 'created',
            changes: { subscription: req.body },
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error creating subscription' },
        });
    }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Subscription not found' },
            });
        }

        // Track changes
        const changes = {};
        Object.keys(req.body).forEach((key) => {
            if (String(subscription[key]) !== String(req.body[key])) {
                changes[key] = { from: subscription[key], to: req.body[key] };
            }
        });

        const updated = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Log activity
        await ActivityLog.create({
            userId: req.user._id,
            entityId: subscription._id,
            action: 'updated',
            changes,
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error updating subscription' },
        });
    }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Subscription not found' },
            });
        }

        // Log activity before deletion
        await ActivityLog.create({
            userId: req.user._id,
            entityId: subscription._id,
            action: 'deleted',
            changes: { deletedSubscription: subscription.toObject() },
        });

        await Subscription.findByIdAndDelete(req.params.id);

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error deleting subscription' },
        });
    }
};

module.exports = {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    subscriptionValidation,
};
