require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');

const plans = [
    {
        name: 'Starter',
        description: 'Perfect for small websites',
        productId: 'prod_RGF3cEXM6E6dbLj',
        stripePriceIds: {
            monthly: 'price_1RGF3cEXM6E6dbLjlEY6uLxk',
            annually: 'price_1RGF3cEXM6E6dbLjDsiUSaOI'
        },
        price: {
            monthly: 29,
            annually: 290
        },
        apiCallsLimit: 1000,
        websiteLimit: 1,
        apiKeyLimit: 1,
        features: [
            '1,000 API calls per month',
            '1 website',
            '1 API key',
            'Basic support'
        ],
        sortOrder: 1,
        isActive: true
    },
    {
        name: 'Professional',
        description: 'For growing businesses',
        productId: 'prod_RGF3dEXM6E6dbLj',
        stripePriceIds: {
            monthly: 'price_1RGF3dEXM6E6dbLjF29KfEZ7',
            annually: 'price_1RGF3dEXM6E6dbLjiZnGuwcV'
        },
        price: {
            monthly: 79,
            annually: 790
        },
        apiCallsLimit: 5000,
        websiteLimit: 3,
        apiKeyLimit: 3,
        features: [
            '5,000 API calls per month',
            'Up to 3 websites',
            '3 API keys',
            'Priority support',
            'Advanced analytics'
        ],
        sortOrder: 2,
        isActive: true
    },
    {
        name: 'Business',
        description: 'For large enterprises',
        productId: 'prod_RGF3eEXM6E6dbLj',
        stripePriceIds: {
            monthly: 'price_1RGF3eEXM6E6dbLjJPY3TzC5',
            annually: 'price_1RGF3fEXM6E6dbLjfjal5lzB'
        },
        price: {
            monthly: 199,
            annually: 1990
        },
        apiCallsLimit: 50000,
        websiteLimit: -1,
        apiKeyLimit: 10,
        features: [
            '50,000 API calls per month',
            'Unlimited websites',
            'Up to 10 API keys',
            '24/7 Premium support',
            'Custom integrations',
            'Dedicated account manager'
        ],
        sortOrder: 3,
        isActive: true
    }
];

const seedPlans = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing plans
        await Plan.deleteMany({});
        console.log('Cleared existing plans');

        // Insert new plans
        const createdPlans = await Plan.insertMany(plans);
        console.log('Successfully seeded plans:');
        createdPlans.forEach(plan => {
            console.log(`- ${plan.name} (${plan._id})`);
        });

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding plans:', error);
        process.exit(1);
    }
};

// Run the seed function
seedPlans(); 