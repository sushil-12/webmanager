const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const { CustomError } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/error_message_codes');

class SubscriptionService {
    // Create a new subscription
    static async createSubscription(userId, planId, billingCycle, paymentMethodId) {
        try {
            // Get the plan
            const plan = await Plan.findById(planId);
            if (!plan) {
                throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Plan not found');
            }

            // Create or get Stripe customer
            let customer;
            const existingSubscription = await Subscription.findOne({ userId, status: 'active' });

            if (existingSubscription) {
                customer = await stripe.customers.retrieve(existingSubscription.stripeCustomerId);
            } else {
                customer = await stripe.customers.create({
                    metadata: { userId: userId.toString() }
                });
            }

            // Verify and attach payment method
            try {
                // First verify the payment method exists
                const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
                if (!paymentMethod) {
                    throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'Invalid payment method');
                }

                // Attach payment method to customer
                await stripe.paymentMethods.attach(paymentMethodId, {
                    customer: customer.id,
                });

                // Set as default payment method
                await stripe.customers.update(customer.id, {
                    invoice_settings: {
                        default_payment_method: paymentMethodId,
                    },
                });
            } catch (error) {
                console.error('Error handling payment method:', error);
                throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'Failed to process payment method. Please try again.');
            }

            // Create Stripe subscription
            const stripeSubscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    price: plan.stripePriceIds[billingCycle]
                }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription',
                },
                expand: ['latest_invoice.payment_intent'],
            });

            // Create subscription in our database
            const subscription = new Subscription({
                userId,
                planId,
                stripeCustomerId: customer.id,
                stripeSubscriptionId: stripeSubscription.id,
                billingCycle,
                amount: plan.price[billingCycle],
                status: 'pending',
                startDate: new Date(),
                nextBillingDate: new Date(stripeSubscription.current_period_end * 1000)
            });

            // Generate initial API key
            subscription.generateApiKey('Default Key');
            await subscription.save();

            if (!subscription._id) {
                throw new CustomError(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create subscription');
            }

            return {
                subscriptionId: subscription._id,
                clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
            };
        } catch (error) {
            console.error('Subscription creation error:', error);
            throw error;
        }
    }

    // Upgrade subscription
    static async upgradeSubscription(userId, newPlanId) {
        try {
            const currentSubscription = await Subscription.findOne({
                userId,
                status: 'active'
            }).populate('planId');

            if (!currentSubscription) {
                throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'No active subscription found')
            }

            const newPlan = await Plan.findById(newPlanId);
            if (!newPlan) {
                throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'New plan not found');
            }

            // Update Stripe subscription
            const updatedStripeSubscription = await stripe.subscriptions.update(
                currentSubscription.stripeSubscriptionId,
                {
                    items: [{
                        id: currentSubscription.stripeSubscriptionId,
                        price: newPlan.stripePriceIds[currentSubscription.billingCycle],
                    }],
                    proration_behavior: 'always_invoice',
                }
            );

            // Update our subscription
            currentSubscription.planId = newPlanId;
            currentSubscription.amount = newPlan.price[currentSubscription.billingCycle];
            currentSubscription.nextBillingDate = new Date(updatedStripeSubscription.current_period_end * 1000);
            await currentSubscription.save();

            return currentSubscription;
        } catch (error) {
            throw error;
        }
    }

    // Cancel subscription
    static async cancelSubscription(userId) {
        try {
            const subscription = await Subscription.findOne({
                userId,
                status: 'active'
            });

            if (!subscription) {
                throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'No active subscription found')
            }

            // Cancel Stripe subscription
            await stripe.subscriptions.del(subscription.stripeSubscriptionId);

            // Update our subscription
            await subscription.updateStatus('cancelled');

            return subscription;
        } catch (error) {
            throw error;
        }
    }

    // Handle Stripe webhook events
    static async handleStripeWebhook(event) {
        try {
            switch (event.type) {
                case 'invoice.payment_succeeded':
                    const subscription = await Subscription.findOne({
                        stripeSubscriptionId: event.data.object.subscription
                    });
                    if (subscription) {
                        subscription.status = 'active';
                        subscription.lastBillingDate = new Date();
                        subscription.nextBillingDate = new Date(event.data.object.lines.data[0].period.end * 1000);
                        await subscription.save();
                    }
                    break;

                case 'invoice.payment_failed':
                    const failedSubscription = await Subscription.findOne({
                        stripeSubscriptionId: event.data.object.subscription
                    });
                    if (failedSubscription) {
                        await failedSubscription.updateStatus('suspended');
                    }
                    break;

                case 'customer.subscription.deleted':
                    const deletedSubscription = await Subscription.findOne({
                        stripeSubscriptionId: event.data.object.id
                    });
                    if (deletedSubscription) {
                        await deletedSubscription.updateStatus('expired');
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    }

    // Generate new API key
    static async generateApiKey(userId, keyName) {
        try {
            const subscription = await Subscription.findOne({
                userId,
                status: 'active'
            });

            if (!subscription) {
                throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'No active subscription found')
            }

            const canAdd = await subscription.canAddApiKey();
            if (!canAdd) {
                throw new CustomError(HTTP_STATUS_CODES.FORBIDDEN, 'API key limit reached for current plan');
            }

            const apiKey = subscription.generateApiKey(keyName);
            await subscription.save();

            return apiKey;
        } catch (error) {
            throw error;
        }
    }

    // Revoke API key
    static async revokeApiKey(userId, apiKey) {
        try {
            const subscription = await Subscription.findOne({
                userId,
                status: 'active',
                'apiKeys.key': apiKey
            });

            if (!subscription) {
                throw new CustomError( HTTP_STATUS_CODES.NOT_FOUND, 'API key not found');
            }

            const keyIndex = subscription.apiKeys.findIndex(k => k.key === apiKey);
            subscription.apiKeys[keyIndex].isActive = false;
            await subscription.save();

            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SubscriptionService; 