const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const analyticsService = require('../services/analyticsService');
const healthScoreService = require('../services/healthScoreService');
const insightService = require('../services/insightService');
const trendService = require('../services/trendService');
const simulationService = require('../services/simulationService');

const getSummary = asyncHandler(async (req, res) => {
    const data = await analyticsService.getSummary(req.user._id);
    sendSuccess(res, data);
});

const getByCategory = asyncHandler(async (req, res) => {
    const data = await analyticsService.getByCategory(req.user._id);
    sendSuccess(res, data);
});

const getTrend = asyncHandler(async (req, res) => {
    const months = parseInt(req.query.months) || 6;
    const data = await analyticsService.getTrend(req.user._id, months);
    sendSuccess(res, data);
});

const getHealthScore = asyncHandler(async (req, res) => {
    const data = await healthScoreService.calculate(req.user._id);
    sendSuccess(res, data);
});

const getSmartInsights = asyncHandler(async (req, res) => {
    const data = await insightService.generate(req.user._id);
    sendSuccess(res, data);
});

const getSpendingSpike = asyncHandler(async (req, res) => {
    const data = await trendService.detectSpike(req.user._id);
    sendSuccess(res, data);
});

const simulateCancel = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
        return res.status(400).json({ success: false, error: { message: 'subscriptionId is required' } });
    }
    const data = await simulationService.simulate(req.user._id, subscriptionId);
    if (data.error) {
        return res.status(404).json({ success: false, error: { message: data.error } });
    }
    sendSuccess(res, data);
});

module.exports = { getSummary, getByCategory, getTrend, getHealthScore, getSmartInsights, getSpendingSpike, simulateCancel };
