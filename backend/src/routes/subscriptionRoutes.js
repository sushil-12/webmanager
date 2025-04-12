const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/protected/SubscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const validateStripeWebhook = require('../middleware/validateStripeWebhook');

console.log("subscriptionRoutes");
// Public routes
router.get('/plans', SubscriptionController.getPlans);
router.post('/webhook', validateStripeWebhook, SubscriptionController.handleWebhook);

// Protected routes
router.use(authMiddleware.verifyToken);
router.post('/upgrade', SubscriptionController.upgradeSubscription);
router.post('/cancel', SubscriptionController.cancelSubscription);
router.post('/api-keys', SubscriptionController.generateApiKey);
router.delete('/api-keys', SubscriptionController.revokeApiKey);

module.exports = router; 