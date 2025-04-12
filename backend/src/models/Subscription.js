const mongoose = require('mongoose');
const crypto = require('crypto');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'suspended', 'pending'],
        default: 'pending'
    },
    stripeCustomerId: {
        type: String,
        required: true
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annually'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    apiKeys: [{
        key: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastUsed: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    autoRenew: {
        type: Boolean,
        default: true
    },
    lastBillingDate: {
        type: Date
    },
    nextBillingDate: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for faster queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ startDate: 1, endDate: 1 });

// Generate a new API key
subscriptionSchema.methods.generateApiKey = function(name) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    this.apiKeys.push({
        key: apiKey,
        name: name,
        isActive: true,
        createdAt: new Date()
    });
    return apiKey;
};

// Validate API key
subscriptionSchema.methods.validateApiKey = function(apiKey) {
    const key = this.apiKeys.find(k => k.key === apiKey && k.isActive);
    if (key) {
        key.lastUsed = new Date();
        return true;
    }
    return false;
};

// Check if can add more API keys
subscriptionSchema.methods.canAddApiKey = async function() {
    const plan = await mongoose.model('Plan').findById(this.planId);
    return this.apiKeys.filter(k => k.isActive).length < plan.apiKeyLimit;
};

// Update subscription status
subscriptionSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'cancelled' || newStatus === 'expired') {
        this.autoRenew = false;
        this.cancelledAt = new Date();
    }
    await this.save();
};

// Static method to find active subscription by API key
subscriptionSchema.statics.findByApiKey = async function(apiKey) {
    return this.findOne({
        'apiKeys.key': apiKey,
        'apiKeys.isActive': true,
        status: 'active'
    }).populate('planId');
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
