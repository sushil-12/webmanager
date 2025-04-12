const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getRecentActivity,
    getContentPerformance,
    getUserProgress,
    getWebsiteStatus,
    getContentCalendar,
    getApiUsage,
    getSubscriptionDetails
} = require('../controllers/protected/dashboardController');

// Apply token verification middleware to all routes

router.use(verifyToken);
// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/content-performance', getContentPerformance);
router.get('/user-progress', getUserProgress);
router.get('/website-status', getWebsiteStatus);
router.get('/content-calendar', getContentCalendar);
router.get('/api-usage', getApiUsage);
router.get('/subscription', getSubscriptionDetails);

module.exports = router; 