const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Website = require('../../models/Websites');
const Subscription = require('../../models/Subscription');
const ActivityLog = require('../../models/ActivityLog');
const { logActivity, getActivityLogs } = require('../../utils/activityLogger');
const moment = require('moment');
const ApiUsageLog = require('../../models/ApiUsageLog');
const Plan = require('../../models/Plan');
const { default: mongoose } = require('mongoose');

// Helper function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

// Helper function to get date range
const getDateRange = (period) => {
    const now = moment();
    switch (period) {
        case '7D':
            return {
                start: now.clone().subtract(7, 'days').startOf('day'),
                end: now.endOf('day')
            };
        case '30D':
            return {
                start: now.clone().subtract(30, 'days').startOf('day'),
                end: now.endOf('day')
            };
        case '90D':
            return {
                start: now.clone().subtract(90, 'days').startOf('day'),
                end: now.endOf('day')
            };
        default:
            return {
                start: now.clone().subtract(7, 'days').startOf('day'),
                end: now.endOf('day')
            };
    }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('role');

        // Get date ranges for comparison
        const currentMonth = moment().startOf('month');
        const lastMonth = moment().subtract(1, 'month').startOf('month');
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');

        // Build query based on user role
        let websiteQuery = {};
        let contentQuery = { deleted: false };
        let userQuery = {};

        if (user.role.name === 'super_admin') {
            // Super admin can see all data
            websiteQuery = {};
            contentQuery = { deleted: false };
            userQuery = {};
        } else if (user.role.name === 'admin') {
            // Admin can see their own data and their managed users' data
            const managedUsers = await User.find({ created_by: userId }).select('_id');
            const managedUserIds = managedUsers.map(u => u._id);
            websiteQuery = { created_by: { $in: [userId, ...managedUserIds] } };
            contentQuery = {
                deleted: false,
                author: { $in: [userId, ...managedUserIds] }
            };
            userQuery = { created_by: userId };
        } else {
            // Regular users can only see their own data
            websiteQuery = { created_by: userId };
            contentQuery = {
                deleted: false,
                author: userId
            };
            userQuery = { _id: userId };
        }

        // Get active websites count and change
        const currentActiveWebsites = await Website.countDocuments(websiteQuery);
        const previousActiveWebsites = await Website.countDocuments({
            ...websiteQuery,
            createdAt: { $lt: currentMonth.toDate() }
        });
        const websiteChange = calculatePercentageChange(currentActiveWebsites, previousActiveWebsites);

        // Get total content count and change
        const currentTotalContent = await Post.countDocuments(contentQuery);
        const previousTotalContent = await Post.countDocuments({
            ...contentQuery,
            createdAt: { $lt: today.toDate() }
        });
        const contentChange = calculatePercentageChange(currentTotalContent, previousTotalContent);

        // Get team members count
        const teamMembers = await User.countDocuments(userQuery);

        // Get recent activities
        const recentActivities = await getActivityLogs(userId, {
            limit: 5,
            skip: 0
        });

        const stats = {
            activeWebsites: {
                count: currentActiveWebsites,
                change: websiteChange
            },
            totalContent: {
                count: currentTotalContent,
                change: contentChange
            },
            teamMembers: {
                count: teamMembers,
                status: 'Active'
            },
            recentActivities: recentActivities.logs
        };

        ResponseHandler.success(res, stats, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Get Recent Activity
const getRecentActivity = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            page = 1,
            limit = 10,
            action,
            status,
            startDate,
            endDate,
            websiteId,
            userId: filterUserId
        } = req.query;

        const activities = await getActivityLogs(userId, {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            action,
            status,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            websiteId,
            userId: filterUserId
        });

        ResponseHandler.success(res, activities, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Helper function to get activity icon
const getActivityIcon = (type) => {
    const icons = {
        content_created: 'document-text',
        content_updated: 'pencil',
        content_deleted: 'trash',
        website_created: 'globe-alt',
        website_updated: 'cog',
        user_created: 'user-plus',
        user_updated: 'user',
        login: 'arrow-right-on-rectangle',
        logout: 'arrow-left-on-rectangle',
        api_request: 'server',
        error: 'exclamation-triangle',
        system: 'cog'
    };
    return icons[type] || 'information-circle';
};

// Get Content Performance
const getContentPerformance = async (req, res) => {
    try {
        const { period = '7D' } = req.query;
        const userId = req.userId;

        // Get date range based on period
        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case '30D':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90D':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default: // 7D
                startDate.setDate(startDate.getDate() - 7);
        }

        // Get daily content performance data from Post model
        const dailyData = await Post.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate, $lte: endDate },
                    deleted: false
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    views: { $sum: "$views" },
                    engagement: { $avg: "$engagementRate" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get top performing content
        const topContent = await Post.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate },
                    deleted: false
                }
            },
            {
                $sort: { views: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    title: 1,
                    views: 1,
                    engagementRate: 1,
                    likes: 1,
                    shares: 1
                }
            }
        ]);

        // Calculate total views and average engagement
        const totalViews = dailyData.reduce((sum, day) => sum + (day.views || 0), 0);
        const avgEngagement = dailyData.reduce((sum, day) => sum + (day.engagement || 0), 0) / dailyData.length || 0;

        // Get previous period data for comparison
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - dailyData.length);

        const previousData = await Post.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: previousStartDate, $lt: startDate },
                    deleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    avgEngagement: { $avg: "$engagementRate" }
                }
            }
        ]);

        const previousViews = previousData[0]?.totalViews || 0;
        const previousEngagement = previousData[0]?.avgEngagement || 0;

        const viewsChange = previousViews ? ((totalViews - previousViews) / previousViews * 100).toFixed(1) : '0';
        const engagementChange = previousEngagement ? ((avgEngagement - previousEngagement) / previousEngagement * 100).toFixed(1) : '0';

        ResponseHandler.success(res, {
            dailyData,
            views: {
                total: totalViews,
                change: `${viewsChange}%`
            },
            engagement: {
                rate: `${avgEngagement.toFixed(1)}%`,
                change: `${engagementChange}%`
            },
            topContent
        });
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Get User Progress
const getUserProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        // Calculate content creation progress
        const userContent = await Post.countDocuments({ author: userId });
        const totalContent = await Post.countDocuments();
        const contentPercentage = totalContent > 0 ? (userContent / totalContent) * 100 : 0;

        // Calculate team collaboration (based on shared content)
        const sharedContent = await Post.countDocuments({
            author: userId,
            sharedWith: { $exists: true, $ne: [] }
        });
        const collaborationPercentage = userContent > 0 ? (sharedContent / userContent) * 100 : 0;

        // Calculate API usage (based on API requests)
        const apiRequests = await ActivityLog.countDocuments({
            userId: userId,
            type: 'api_request'
        });
        const apiPercentage = Math.min((apiRequests / 1000) * 100, 100); // Assuming 1000 requests is full usage

        // Calculate level based on total points
        const totalPoints = (contentPercentage * 10) + (collaborationPercentage * 10) + (apiPercentage * 10);
        const currentLevel = getLevelFromPoints(totalPoints);
        const nextLevel = getNextLevel(currentLevel);

        const progress = {
            contentCreation: {
                percentage: Math.round(contentPercentage),
                points: Math.round(contentPercentage * 10)
            },
            teamCollaboration: {
                percentage: Math.round(collaborationPercentage),
                points: Math.round(collaborationPercentage * 10)
            },
            apiUsage: {
                percentage: Math.round(apiPercentage),
                points: Math.round(apiPercentage * 10)
            },
            currentLevel: currentLevel,
            nextLevel: {
                points: nextLevel.points,
                remaining: nextLevel.points - totalPoints
            }
        };

        ResponseHandler.success(res, progress, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Helper function to determine user level
const getLevelFromPoints = (points) => {
    if (points >= 2500) return 'Pro';
    if (points >= 1500) return 'Advanced';
    if (points >= 500) return 'Intermediate';
    return 'Beginner';
};

// Helper function to get next level requirements
const getNextLevel = (currentLevel) => {
    const levels = {
        'Beginner': { points: 500, name: 'Intermediate' },
        'Intermediate': { points: 1500, name: 'Advanced' },
        'Advanced': { points: 2500, name: 'Pro' },
        'Pro': { points: 5000, name: 'Elite' }
    };
    return levels[currentLevel];
};

// Get Website Status
const getWebsiteStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        // Get websites based on user's role and permissions
        const query = user.role.name === 'super_admin'
            ? { status: 'active' }
            : {
                status: 'active',
                _id: { $in: Object.keys(user.permissions || {}) }
            };

        const websites = await Website.find(query)
            .select('business_name content_items last_updated api_usage')
            .limit(3)
            .lean();

        const formattedWebsites = await Promise.all(websites.map(async (website) => {
            // Get content count
            const contentCount = await Post.countDocuments({
                website: website._id,
                deleted: false
            });

            // Get API usage from ActivityLog
            const apiUsage = await ActivityLog.countDocuments({
                type: 'api_request',
                'metadata.websiteId': website._id.toString()
            });

            // Get last updated content
            const lastUpdatedContent = await Post.findOne({
                website: website._id,
                deleted: false
            })
                .sort({ updatedAt: -1 })
                .select('updatedAt')
                .lean();

            return {
                id: website._id,
                name: website.business_name,
                status: 'Active',
                contentItems: contentCount,
                lastUpdated: lastUpdatedContent?.updatedAt || website.last_updated || new Date(),
                apiUsage: apiUsage
            };
        }));

        ResponseHandler.success(res, { websites: formattedWebsites }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Get Content Calendar
const getContentCalendar = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        // Get upcoming content tasks based on user's role and permissions
        const query = user.role.name === 'super_admin'
            ? {
                status: { $in: ['draft', 'pending_review'] },
                publicationDate: { $gte: new Date() }
            }
            : {
                author: userId,
                status: { $in: ['draft', 'pending_review'] },
                publicationDate: { $gte: new Date() }
            };

        const upcomingTasks = await Post.find(query)
            .sort('publicationDate')
            .limit(5)
            .select('title publicationDate status website')
            .populate('website', 'business_name')
            .lean();

        const formattedTasks = upcomingTasks.map(task => ({
            id: task._id,
            title: task.title,
            dueDate: task.publicationDate,
            status: task.status,
            website: task.website?.business_name || 'Unknown Website'
        }));

        ResponseHandler.success(res, { tasks: formattedTasks }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getApiUsage = async (req, res) => {
    try {
        const { period = '7D' } = req.query;
        const userId = req.userId;

        // Get date range based on period
        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case '30D':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90D':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default: // 7D
                startDate.setDate(startDate.getDate() - 7);
        }

        console.log(userId, "USER ID");
        const totalApiRequests = await ApiUsageLog.countDocuments({
            userId: new mongoose.Types.ObjectId(userId),
        });

        // Get daily API usage data
        const dailyApiUsage = await ApiUsageLog.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 },
                    successCount: {
                        $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] }
                    },
                    errorCount: {
                        $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] }
                    },
                    avgResponseTime: { $avg: "$responseTime" },
                    endpoints: {
                        $push: {
                            endpoint: "$endpoint",
                            method: "$method",
                            count: 1
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    successCount: 1,
                    errorCount: 1,
                    avgResponseTime: 1,
                    topEndpoints: {
                        $slice: [
                            {
                                $reduce: {
                                    input: "$endpoints",
                                    initialValue: [],
                                    in: {
                                        $concatArrays: [
                                            "$$value",
                                            [{
                                                endpoint: "$$this.endpoint",
                                                method: "$$this.method",
                                                count: "$$this.count"
                                            }]
                                        ]
                                    }
                                }
                            },
                            5
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log(dailyApiUsage, "DAILY API USAGE");

        // Calculate totals
        const totalRequests = dailyApiUsage.reduce((sum, day) => sum + day.count, 0);
        const successRate = dailyApiUsage.reduce((sum, day) => sum + day.successCount, 0) / totalRequests * 100;
        const avgResponseTime = dailyApiUsage.reduce((sum, day) => sum + day.avgResponseTime, 0) / dailyApiUsage.length;

        // Get previous period data for comparison
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - dailyApiUsage.length);

        const previousData = await ApiUsageLog.aggregate([
            {
                $match: {
                    userId,
                    timestamp: { $gte: previousStartDate, $lt: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    avgResponseTime: { $avg: "$responseTime" }
                }
            }
        ]);

        const previousRequests = previousData[0]?.totalRequests || 0;
        const previousAvgResponseTime = previousData[0]?.avgResponseTime || 0;
        const requestsChange = ((totalRequests - previousRequests) / previousRequests * 100).toFixed(1);
        const responseTimeChange = ((avgResponseTime - previousAvgResponseTime) / previousAvgResponseTime * 100).toFixed(1);

        // Get current subscription details
        const subscription = await Subscription.findOne({ userId, status: 'active' })
            .populate('planId')
            .lean();

        const apiUsageLimit = subscription?.planId?.apiCallsLimit || 0;
        const usagePercentage = (totalRequests / apiUsageLimit) * 100;

        ResponseHandler.success(res, {
            dailyData: dailyApiUsage,
            totalRequests: totalApiRequests,
            total: {
                requests: totalRequests,
                change: `${requestsChange}%`,
                successRate: `${successRate.toFixed(1)}%`,
                avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
                responseTimeChange: `${responseTimeChange}%`
            },
            limits: {
                used: totalRequests,
                totalRequests: totalApiRequests,
                limit: apiUsageLimit,
                percentage: usagePercentage.toFixed(1)
            }
        });
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

// Get Subscription Details
const getSubscriptionDetails = async (req, res) => {
    try {
        const userId = req.userId;

        // Get user's subscription details
        const subscription = await Subscription.findOne({
            userId,
            status: 'active'
        })
            .sort({ createdAt: -1 })
            .populate('planId')
            .lean();

        if (!subscription) {
            throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'No active subscription found');
        }

        // Calculate next payment date
        const nextPaymentDate = subscription.nextBillingDate || (
            subscription.billingCycle === 'monthly'
                ? moment(subscription.startDate).add(1, 'month')
                : moment(subscription.startDate).add(1, 'year')
        );

        // Calculate days remaining in current billing cycle
        const daysRemaining = moment(nextPaymentDate).diff(moment(), 'days');

        // Calculate API usage percentage
        const apiUsageLimit = subscription?.planId?.apiCallsLimit;
        const currentApiUsage = await ApiUsageLog.countDocuments({
            userId,
            timestamp: {
                $gte: moment().startOf(subscription.billingCycle === 'monthly' ? 'month' : 'year')
            }
        });

        const apiUsagePercentage = (currentApiUsage / apiUsageLimit) * 100;

        // Get website usage
        const websiteLimit = subscription?.planId?.websiteLimit;
        const currentWebsites = await Website.countDocuments({ created_by: userId });
        const websiteUsagePercentage = websiteLimit === -1 ? 0 : (currentWebsites / websiteLimit) * 100;
        const apiKeyLimit = subscription?.planId?.apiKeyLimit;
        const currentApiKeysCount = await Subscription.countDocuments({ userId, 'apiKeys.isActive': true });
        const currentApikeys = await Subscription.findOne({ userId, 'apiKeys.isActive': true });
        const subscriptionDetails = {
            plan: {
                name: subscription?.planId?.name,
                price: `$${subscription?.amount}`,
                billingCycle: subscription?.billingCycle,
                status: subscription?.status
            },
            nextPaymentDate: moment(nextPaymentDate).format('YYYY-MM-DD'),
            daysRemaining,
            apiKeys: {
                used: currentApiKeysCount,
                limit: apiKeyLimit,
                keys: currentApikeys
            },
            usage: {
                api: {
                    used: currentApiUsage,
                    limit: apiUsageLimit,
                    percentage: apiUsagePercentage.toFixed(1)
                },
                websites: {
                    used: currentWebsites,
                    limit: websiteLimit === -1 ? 'Unlimited' : websiteLimit,
                    percentage: websiteLimit === -1 ? 0 : websiteUsagePercentage.toFixed(1)
                }
            },
            features: subscription?.planId?.features
        };

        ResponseHandler.success(res, subscriptionDetails, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivity,
    getContentPerformance,
    getUserProgress,
    getWebsiteStatus,
    getContentCalendar,
    getApiUsage,
    getSubscriptionDetails
};