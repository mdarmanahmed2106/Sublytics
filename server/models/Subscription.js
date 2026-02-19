const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Subscription name is required'],
            maxlength: 100,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 500,
            default: '',
        },
        category: {
            type: String,
            enum: ['Entertainment', 'Productivity', 'Fitness', 'Finance', 'Other'],
            required: [true, 'Category is required'],
            index: true,
        },
        cost: {
            type: Number,
            required: [true, 'Cost is required'],
            min: 0,
        },
        billingCycle: {
            type: String,
            enum: ['monthly', 'quarterly', 'annually', 'custom'],
            required: [true, 'Billing cycle is required'],
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'cancelled'],
            default: 'active',
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
