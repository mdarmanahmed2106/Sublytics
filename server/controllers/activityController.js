const ActivityLog = require('../models/ActivityLog');

// @desc    Get user activity feed
// @route   GET /api/activity
const getActivityFeed = async (req, res) => {
    try {
        const { action, limit, page } = req.query;
        const filter = { userId: req.user._id };

        if (action) filter.action = action;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const [activities, total] = await Promise.all([
            ActivityLog.find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate('entityId', 'name category cost'),
            ActivityLog.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: activities,
            meta: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Error fetching activity feed' },
        });
    }
};

module.exports = { getActivityFeed };
