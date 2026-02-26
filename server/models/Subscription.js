const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
            enum: [
                'Entertainment', 'Music', 'Gaming', 'Streaming',
                'Productivity', 'Storage', 'Fitness', 'Education',
                'Shopping', 'Finance', 'News', 'Social',
                'Food', 'Health', 'Utilities', 'Other',
            ],
            required: [true, 'Category is required'],
        },
        cost: {
            type: Number,
            required: [true, 'Cost is required'],
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
            enum: ['INR', 'USD', 'EUR', 'GBP'],
        },
        billingInterval: {
            value: { type: Number, required: true, default: 1, min: 1 },
            unit: {
                type: String,
                enum: ['day', 'week', 'month', 'year'],
                required: true,
                default: 'month',
            },
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
        nextBillingDate: {
            type: Date,
        },
        autoRenew: {
            type: Boolean,
            default: true,
        },
        reminderDaysBefore: {
            type: Number,
            default: 3,
            min: 0,
            max: 30,
        },
        lastUsedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// ── Indexes for performance ──
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ userId: 1, nextBillingDate: 1 });
subscriptionSchema.index({ userId: 1, category: 1 });
subscriptionSchema.index({ userId: 1, createdAt: -1 });
subscriptionSchema.index({ userId: 1, status: 1, lastUsedAt: 1 });

// ── Auto-calculate nextBillingDate ──
subscriptionSchema.pre('save', function () {
    if ((this.isModified('startDate') || this.isModified('billingInterval') || this.isNew)
        && this.startDate && this.billingInterval && this.billingInterval.unit) {
        this.nextBillingDate = calcNextBilling(this.startDate, this.billingInterval);
    }
});

function calcNextBilling(startDate, interval) {
    if (!startDate || !interval || !interval.unit || !interval.value) return null;
    const now = new Date();
    let date = new Date(startDate);
    if (isNaN(date.getTime())) return null;
    let safety = 0;
    while (date <= now && safety < 10000) {
        safety++;
        switch (interval.unit) {
            case 'day':
                date.setDate(date.getDate() + interval.value);
                break;
            case 'week':
                date.setDate(date.getDate() + interval.value * 7);
                break;
            case 'month':
                date.setMonth(date.getMonth() + interval.value);
                break;
            case 'year':
                date.setFullYear(date.getFullYear() + interval.value);
                break;
            default:
                return null;
        }
    }
    return date;
}

module.exports = mongoose.model('Subscription', subscriptionSchema);

