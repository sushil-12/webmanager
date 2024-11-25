const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    customerId: {
      type: String, // Stripe Customer ID
      required: true,
    },
    subscriptionId: {
      type: String, // Stripe Subscription ID
      required: true,
      unique: true,
    },
    productId: {
      type: String, // Stripe Product ID
      required: true,
    },
    priceId: {
      type: String, // Stripe Price ID
      required: true,
    },
    status: {
      type: String, // Subscription status (e.g., active, canceled, trialing, etc.)
      required: true,
    },
    startDate: {
      type: Date, // Subscription start date
      required: true,
    },
    endDate: {
      type: Date, // Subscription end date
      required: true,
    },
    paymentIntentId: {
      type: String, // Stripe PaymentIntent ID
    },
    paymentStatus: {
      type: String, // Payment status (e.g., succeeded, requires_action, etc.)
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);
