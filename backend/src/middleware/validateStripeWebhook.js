const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CustomError } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/error_message_codes');

const validateStripeWebhook = (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
        throw new CustomError('No Stripe signature found', HTTP_STATUS_CODES.BAD_REQUEST);
    }

    try {
        // Raw body is required for webhook signature verification
        const event = stripe.webhooks.constructEvent(
            req.rawBody, // Express needs to be configured to provide raw body
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        req.stripeEvent = event;
        next();
    } catch (err) {
        throw new CustomError(`Webhook Error: ${err.message}`, HTTP_STATUS_CODES.BAD_REQUEST);
    }
};

module.exports = validateStripeWebhook; 