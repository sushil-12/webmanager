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
    getSubscriptionDetails,
    getSystemStats,
    getUserActivities,
    getSecurityAlerts,
    getSubscribedUsers
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

// Super Admin Dashboard routes
router.get('/system-stats', getSystemStats);
router.get('/user-activities', getUserActivities);
router.get('/security-alerts', getSecurityAlerts);

// Get subscribed users list (Super Admin)
router.get('/subscribed-users', getSubscribedUsers); 
module.exports = router; 