const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    apiCallsUsed: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
userSubscriptionSchema.index({ userId: 1 });
userSubscriptionSchema.index({ apiKey: 1 });
userSubscriptionSchema.index({ isActive: 1 });

// Method to check if subscription is valid
userSubscriptionSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && 
           this.endDate > now;
};

// Method to increment API calls
userSubscriptionSchema.methods.incrementApiCalls = async function() {
    this.apiCallsUsed += 1;
    await this.save();
};

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

module.exports = UserSubscription; 