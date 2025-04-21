const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CustomError } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/error_message_codes');

const validateStripeWebhook = (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        return next(new CustomError('No Stripe signature found', HTTP_STATUS_CODES.BAD_REQUEST));
    }

    if (!Buffer.isBuffer(req.body)) {
        return next(new CustomError('Expected raw body as Buffer', HTTP_STATUS_CODES.BAD_REQUEST));
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body, // this is a Buffer!
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_1c94b0188b094d6568ce5c195b77ae4c08d9d47099a8fff22ab4fd43ede9654b'
        );
        console.log("event ", event)
        req.stripeEvent = event;
        next();
    } catch (err) {
        console.log(err.message)
        return next(new CustomError(`Webhook Error: ${err.message}`, HTTP_STATUS_CODES.BAD_REQUEST));
    }
};

module.exports = validateStripeWebhook;
