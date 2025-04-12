const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    stripePriceIds: {
        monthly: {
            type: String,
            required: true
        },
        annually: {
            type: String,
            required: true
        }
    },
    price: {
        monthly: {
            type: Number,
            required: true
        },
        annually: {
            type: Number,
            required: true
        }
    },
    apiCallsLimit: {
        type: Number,
        required: true
    },
    websiteLimit: {
        type: Number, // -1 for unlimited
        required: true
    },
    apiKeyLimit: {
        type: Number,
        required: true,
        default: 1
    },
    features: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for faster queries
planSchema.index({ isActive: 1, sortOrder: 1 });

// Static method to get plan by Stripe price ID
planSchema.statics.findByStripePriceId = async function(priceId) {
    return this.findOne({
        $or: [
            { 'stripePriceIds.monthly': priceId },
            { 'stripePriceIds.annually': priceId }
        ]
    });
};

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan; 