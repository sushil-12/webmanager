require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plan = require('../models/Plan');
const mongoose = require('mongoose');

const products = [
    {
        name: 'Starter Plan',
        description: 'Perfect for small websites',
        features: [
            '1,000 API calls per month',
            '1 website',
            '1 API key',
            'Basic support'
        ],
        prices: {
            monthly: {
                amount: 2900, // $29.00
                currency: 'usd',
                interval: 'month'
            },
            annually: {
                amount: 29000, // $290.00
                currency: 'usd',
                interval: 'year'
            }
        }
    },
    {
        name: 'Professional Plan',
        description: 'For growing businesses',
        features: [
            '5,000 API calls per month',
            'Up to 3 websites',
            '3 API keys',
            'Priority support',
            'Advanced analytics'
        ],
        prices: {
            monthly: {
                amount: 7900, // $79.00
                currency: 'usd',
                interval: 'month'
            },
            annually: {
                amount: 79000, // $790.00
                currency: 'usd',
                interval: 'year'
            }
        }
    },
    {
        name: 'Business Plan',
        description: 'For large enterprises',
        features: [
            '50,000 API calls per month',
            'Unlimited websites',
            'Up to 10 API keys',
            '24/7 Premium support',
            'Custom integrations',
            'Dedicated account manager'
        ],
        prices: {
            monthly: {
                amount: 19900, // $199.00
                currency: 'usd',
                interval: 'month'
            },
            annually: {
                amount: 199000, // $1,990.00
                currency: 'usd',
                interval: 'year'
            }
        }
    }
];

const setupStripeProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const product of products) {
            // Create product in Stripe
            console.log(`Creating product: ${product.name}`);
            const stripeProduct = await stripe.products.create({
                name: product.name,
                description: product.description,
                metadata: {
                    features: JSON.stringify(product.features)
                }
            });

            // Create prices for the product
            console.log('Creating prices...');
            const monthlyPrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: product.prices.monthly.amount,
                currency: product.prices.monthly.currency,
                recurring: {
                    interval: product.prices.monthly.interval
                },
                metadata: {
                    type: 'monthly'
                }
            });

            const annualPrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: product.prices.annually.amount,
                currency: product.prices.annually.currency,
                recurring: {
                    interval: product.prices.annually.interval
                },
                metadata: {
                    type: 'annual'
                }
            });

            // Update the plan in MongoDB with Stripe price IDs
            await Plan.findOneAndUpdate(
                { name: product.name.split(' ')[0] }, // Get the first word of product name (e.g., "Starter" from "Starter Plan")
                {
                    stripePriceIds: {
                        monthly: monthlyPrice.id,
                        annually: annualPrice.id
                    }
                }
            );

            console.log(`Created product ${product.name} with prices:`, {
                monthly: monthlyPrice.id,
                annually: annualPrice.id
            });
        }

        console.log('Successfully set up all products and prices in Stripe');
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up Stripe products:', error);
        process.exit(1);
    }
};

setupStripeProducts(); 