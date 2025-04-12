const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const SubscriptionService = require('../../services/subscriptionService');
const Plan = require('../../models/Plan');

// Get available plans
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true })
            .sort('sortOrder')
            .lean();

        ResponseHandler.success(res, plans, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Upgrade subscription
const upgradeSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.userId;

        const subscription = await SubscriptionService.upgradeSubscription(userId, planId);
        ResponseHandler.success(res, subscription, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
    try {
        const userId = req.userId;
        const subscription = await SubscriptionService.cancelSubscription(userId);
        ResponseHandler.success(res, subscription, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Generate new API key
const generateApiKey = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.userId;

        const apiKey = await SubscriptionService.generateApiKey(userId, name);
        ResponseHandler.success(res, { apiKey }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Revoke API key
const revokeApiKey = async (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.userId;

        await SubscriptionService.revokeApiKey(userId, apiKey);
        ResponseHandler.success(res, { message: 'API key revoked successfully' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Handle Stripe webhook
const handleWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        await SubscriptionService.handleStripeWebhook(event);
        ResponseHandler.success(res, { received: true }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    getPlans,
    upgradeSubscription,
    cancelSubscription,
    generateApiKey,
    revokeApiKey,
    handleWebhook
}; 