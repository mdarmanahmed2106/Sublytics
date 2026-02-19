const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    action: {
        type: String,
        enum: ['created', 'updated', 'deleted'],
        required: true,
    },
    changes: {
        type: Object,
        default: {},
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
