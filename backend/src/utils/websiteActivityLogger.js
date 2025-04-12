const { logActivity } = require('./activityLogger');

const logWebsiteActivity = async (req, action, description, status = 'success', metadata = {}) => {
    try {
        const activity = await logActivity({
            userId: req.userId,
            action,
            description,
            status,
            metadata,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            affectedWebsite: req.params.websiteId || req.body.websiteId || null
        });
        return activity;
    } catch (error) {
        console.error('Error logging website activity:', error);
        throw error;
    }
};

// Helper function to track field changes
const trackFieldChanges = (oldData, newData) => {
    const changes = {};
    for (const key in newData) {
        if (oldData[key] !== newData[key]) {
            changes[key] = {
                old: oldData[key],
                new: newData[key]
            };
        }
    }
    return changes;
};

// Website Management Activities
const logWebsiteCreation = async (req, websiteId, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'website_created', 'New website created', status, {
        ...metadata,
        websiteId,
        fieldChanges: {
            ...metadata
        }
    });
};

const logWebsiteUpdate = async (req, websiteId, oldData, newData, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldData, newData);
    return logWebsiteActivity(req, 'website_updated', 'Website information updated', status, {
        ...metadata,
        websiteId,
        fieldChanges
    });
};

const logWebsiteDeletion = async (req, websiteId, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'website_deleted', 'Website deleted', status, {
        ...metadata,
        websiteId,
        fieldChanges: {
            deleted: true
        }
    });
};

// Website Content Activities
const logContentCreation = async (req, websiteId, contentId, contentType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'content_created', `${contentType} created`, status, {
        ...metadata,
        websiteId,
        contentId,
        contentType,
        fieldChanges: {
            created: true,
            ...metadata
        }
    });
};

const logContentUpdate = async (req, websiteId, contentId, contentType, oldData, newData, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldData, newData);
    return logWebsiteActivity(req, 'content_updated', `${contentType} updated`, status, {
        ...metadata,
        websiteId,
        contentId,
        contentType,
        fieldChanges
    });
};

const logContentDeletion = async (req, websiteId, contentId, contentType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'content_deleted', `${contentType} deleted`, status, {
        ...metadata,
        websiteId,
        contentId,
        contentType,
        fieldChanges: {
            deleted: true
        }
    });
};

// Website Settings Activities
const logSettingsUpdate = async (req, websiteId, settingsType, oldSettings, newSettings, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldSettings, newSettings);
    return logWebsiteActivity(req, 'settings_updated', `${settingsType} settings updated`, status, {
        ...metadata,
        websiteId,
        settingsType,
        fieldChanges
    });
};

// Website Analytics Activities
const logAnalyticsUpdate = async (req, websiteId, analyticsType, oldAnalytics, newAnalytics, status = 'success', metadata = {}) => {
    const fieldChanges = trackFieldChanges(oldAnalytics, newAnalytics);
    return logWebsiteActivity(req, 'analytics_updated', `${analyticsType} analytics updated`, status, {
        ...metadata,
        websiteId,
        analyticsType,
        fieldChanges
    });
};

// Website Integration Activities
const logIntegrationAdded = async (req, websiteId, integrationType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'integration_added', `${integrationType} integration added`, status, {
        ...metadata,
        websiteId,
        integrationType,
        fieldChanges: {
            added: true,
            integrationType
        }
    });
};

const logIntegrationRemoved = async (req, websiteId, integrationType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'integration_removed', `${integrationType} integration removed`, status, {
        ...metadata,
        websiteId,
        integrationType,
        fieldChanges: {
            removed: true,
            integrationType
        }
    });
};

// Website Backup Activities
const logBackupCreated = async (req, websiteId, backupType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'backup_created', `${backupType} backup created`, status, {
        ...metadata,
        websiteId,
        backupType,
        fieldChanges: {
            created: true,
            backupType
        }
    });
};

const logBackupRestored = async (req, websiteId, backupType, status = 'success', metadata = {}) => {
    return logWebsiteActivity(req, 'backup_restored', `${backupType} backup restored`, status, {
        ...metadata,
        websiteId,
        backupType,
        fieldChanges: {
            restored: true,
            backupType
        }
    });
};

module.exports = {
    logWebsiteCreation,
    logWebsiteUpdate,
    logWebsiteDeletion,
    logContentCreation,
    logContentUpdate,
    logContentDeletion,
    logSettingsUpdate,
    logAnalyticsUpdate,
    logIntegrationAdded,
    logIntegrationRemoved,
    logBackupCreated,
    logBackupRestored
}; 