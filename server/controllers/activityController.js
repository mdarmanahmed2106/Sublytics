const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const getActivityFeed = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        ActivityLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .populate('entityId', 'name'),
        ActivityLog.countDocuments({ userId: req.user._id }),
    ]);

    sendSuccess(res, {
        logs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

module.exports = { getActivityFeed };
