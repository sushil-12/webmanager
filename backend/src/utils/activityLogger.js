const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const Website = require('../models/Websites');

const logActivity = async ({
    userId,
    action,
    description,
    status = 'success',
    metadata = {},
    ipAddress,
    userAgent,
    affectedUser = null,
    affectedWebsite = null,
    affectedContent = null
}) => {
    try {
        const activity = new ActivityLog({
            userId,
            action,
            description,
            status,
            metadata,
            ipAddress,
            userAgent,
            affectedUser,
            affectedWebsite,
            affectedContent
        });

        await activity.save();
        return activity;
    } catch (error) {
        console.error('Error logging activity:', error);
        throw error;
    }
};

const getActivityLogs = async (userId, options = {}) => {
    try {
        const user = await User.findById(userId).populate('role');
        if (!user) throw new Error('User not found');

        let query = {};

        // Handle different user roles
        if (user.role.name === 'super_admin') {
            // Super admin can see all logs
            query = {};
        } else if (user.role.name === 'admin') {
            // Admin can see their own logs and logs of users they manage
            const managedUsers = await User.find({ created_by: userId }).select('_id');
            const managedUserIds = managedUsers.map(u => u._id);
            
            // Get websites managed by this admin
            const managedWebsites = await Website.find({ created_by: userId }).select('_id');
            const managedWebsiteIds = managedWebsites.map(w => w._id);

            query = {
                $or: [
                    // Activities performed by the admin
                    { userId: userId },
                    // Activities performed by managed users
                    { userId: { $in: managedUserIds } },
                    // Activities on managed websites
                    { affectedWebsite: { $in: managedWebsiteIds } }
                ]
            };
        } else {
            // Regular users can only see their own logs and logs of websites they have access to
            const userWebsites = await Website.find({ 
                $or: [
                    { created_by: userId },
                    { teamMembers: userId }
                ]
            }).select('_id');
            const userWebsiteIds = userWebsites.map(w => w._id);

            query = {
                $or: [
                    // User's own activities
                    { userId: userId },
                    // Activities on websites they have access to
                    { affectedWebsite: { $in: userWebsiteIds } }
                ]
            };
        }

        // Apply website filter if provided
        if (options.websiteId) {
            query.affectedWebsite = options.websiteId;
        }

        // Apply user filter if provided
        if (options.userId) {
            if (user.role.name === 'super_admin') {
                query.userId = options.userId;
            } else if (user.role.name === 'admin') {
                // Admin can only filter by their managed users
                const managedUsers = await User.find({ created_by: userId }).select('_id');
                const managedUserIds = managedUsers.map(u => u._id);
                if (!managedUserIds.includes(options.userId) && options.userId !== userId) {
                    throw new Error('Unauthorized to view activities of this user');
                }
                query.userId = options.userId;
            } else {
                // Regular users can only filter by themselves
                if (options.userId !== userId) {
                    throw new Error('Unauthorized to view activities of other users');
                }
                query.userId = options.userId;
            }
        }

        // Apply additional filters if provided
        if (options.action) query.action = options.action;
        if (options.status) query.status = options.status;
        if (options.startDate) query.createdAt = { $gte: options.startDate };
        if (options.endDate) {
            query.createdAt = query.createdAt || {};
            query.createdAt.$lte = options.endDate;
        }

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .skip(options.skip || 0)
            .limit(options.limit || 10)
            .populate('userId', 'username email firstName lastName')
            .populate('affectedUser', 'username email firstName lastName')
            .populate('affectedWebsite', 'business_name url')
            .populate('affectedContent', 'title');

        const total = await ActivityLog.countDocuments(query);

        // Format the response with additional context
        const formattedLogs = logs.map(log => ({
            ...log.toObject(),
            userContext: {
                isCurrentUser: log.userId._id.toString() === userId,
                isManagedUser: user.role.name === 'admin' && 
                    log.userId._id.toString() !== userId &&
                    log.userId.created_by === userId
            },
            websiteContext: {
                isManagedWebsite: user.role.name === 'admin' && 
                    log.affectedWebsite && 
                    log.affectedWebsite.created_by === userId
            }
        }));

        return {
            logs: formattedLogs,
            total,
            page: options.skip ? Math.floor(options.skip / options.limit) + 1 : 1,
            totalPages: Math.ceil(total / (options.limit || 10))
        };
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
    }
};

module.exports = {
    logActivity,
    getActivityLogs
}; 