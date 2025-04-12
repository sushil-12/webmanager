const { logActivity } = require('./activityLogger');

const logUserActivity = async (req, action, description, status = 'success', metadata = {}) => {
    try {
        const activity = await logActivity({
            userId: req.userId,
            action,
            description,
            status,
            metadata,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            affectedUser: req.params.userId || req.body.userId || null
        });
        return activity;
    } catch (error) {
        console.error('Error logging user activity:', error);
        throw error;
    }
};

// Helper function to track field changes
const trackFieldChanges = (oldData, newData) => {
    const changes = {};
    // Only track fields that exist in both objects and have actually changed
    Object.keys(newData).forEach(key => {
        if (oldData.hasOwnProperty(key) && newData[key] !== undefined && oldData[key] !== newData[key]) {
            changes[key] = {
                old: oldData[key],
                new: newData[key]
            };
        }
    });
    return Object.keys(changes).length > 0 ? changes : null;
};

// User Authentication Activities
const logLogin = async (req, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'login', 'User logged in', status, metadata);
};

const logLogout = async (req, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'logout', 'User logged out', status, metadata);
};

const logPasswordReset = async (req, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'password_reset', 'Password reset requested', status, metadata);
};

// User Management Activities
const logUserCreation = async (req, newUserId, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'user_created', 'New user created', status, {
        ...metadata,
        newUserId,
        fieldChanges: {
            created: true,
            ...metadata
        }
    });
};

const logUserUpdate = async (req, userId, oldData, newData, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldData, newData);
    
    // Only create a log if there are actual changes
    if (fieldChanges) {
        let description = 'User information updated';
        let action = 'user_updated';

        // If only permissions changed
        if (Object.keys(fieldChanges).length === 1 && fieldChanges.permissions) {
            action = 'permission_updated';
            description = 'User permissions updated';
        }
        // If only role changed
        else if (Object.keys(fieldChanges).length === 1 && fieldChanges.role) {
            action = 'role_changed';
            description = 'User role changed';
        }

        return logUserActivity(req, action, description, status, {
            ...metadata,
            userId,
            fieldChanges
        });
    }
    return null;
};

const logUserDeletion = async (req, userId, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'user_deleted', 'User deleted', status, {
        ...metadata,
        userId,
        fieldChanges: {
            deleted: true
        }
    });
};

const logRoleChange = async (req, userId, oldRole, newRole, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'role_changed', 'User role changed', status, {
        ...metadata,
        userId,
        fieldChanges: {
            role: {
                old: oldRole,
                new: newRole
            }
        }
    });
};

const logPermissionUpdate = async (req, userId, oldPermissions, newPermissions, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldPermissions, newPermissions);
    return logUserActivity(req, 'permission_updated', 'User permissions updated', status, {
        ...metadata,
        userId,
        fieldChanges
    });
};

// Team Management Activities
const logTeamMemberAdded = async (req, websiteId, userId, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'team_member_added', 'New team member added', status, {
        ...metadata,
        websiteId,
        userId,
        fieldChanges: {
            added: true,
            websiteId,
            userId
        }
    });
};

const logTeamMemberRemoved = async (req, websiteId, userId, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'team_member_removed', 'Team member removed', status, {
        ...metadata,
        websiteId,
        userId,
        fieldChanges: {
            removed: true,
            websiteId,
            userId
        }
    });
};

const logTeamRoleChange = async (req, websiteId, userId, oldRole, newRole, status = 'success', metadata = {}) => {
    return logUserActivity(req, 'team_role_changed', 'Team member role changed', status, {
        ...metadata,
        websiteId,
        userId,
        fieldChanges: {
            role: {
                old: oldRole,
                new: newRole
            }
        }
    });
};

module.exports = {
    logLogin,
    logLogout,
    logPasswordReset,
    logUserCreation,
    logUserUpdate,
    logUserDeletion,
    logRoleChange,
    logPermissionUpdate,
    logTeamMemberAdded,
    logTeamMemberRemoved,
    logTeamRoleChange
}; 