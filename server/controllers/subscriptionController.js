const { body, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const subscriptionService = require('../services/subscriptionService');

// ── Validation ──
const subscriptionValidation = [
    body('name').trim().notEmpty().withMessage('Subscription name is required'),
    body('category')
        .isIn([
            'Entertainment', 'Music', 'Gaming', 'Streaming',
            'Productivity', 'Storage', 'Fitness', 'Education',
            'Shopping', 'Finance', 'News', 'Social',
            'Food', 'Health', 'Utilities', 'Other',
        ])
        .withMessage('Invalid category'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('billingInterval.value').optional().isNumeric().withMessage('Billing interval value must be a number'),
    body('billingInterval.unit').optional().isIn(['day', 'week', 'month', 'year']).withMessage('Invalid billing interval unit'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
];

const handleValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR');
    }
};

// ── Controllers ──

const getSubscriptions = asyncHandler(async (req, res) => {
    const data = await subscriptionService.list(req.user._id, req.query);
    sendSuccess(res, data);
});

const getSubscription = asyncHandler(async (req, res) => {
    const data = await subscriptionService.getById(req.user._id, req.params.id);
    sendSuccess(res, data);
});

const createSubscription = asyncHandler(async (req, res) => {
    handleValidation(req);
    const data = await subscriptionService.create(req.user._id, req.body);
    sendSuccess(res, data, 201);
});

const updateSubscription = asyncHandler(async (req, res) => {
    const data = await subscriptionService.update(req.user._id, req.params.id, req.body);
    sendSuccess(res, data);
});

const deleteSubscription = asyncHandler(async (req, res) => {
    await subscriptionService.remove(req.user._id, req.params.id);
    sendSuccess(res, {});
});

const markSubscriptionUsed = asyncHandler(async (req, res) => {
    const data = await subscriptionService.markAsUsed(req.user._id, req.params.id);
    sendSuccess(res, data);
});

module.exports = {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    markSubscriptionUsed,
    subscriptionValidation,
};
