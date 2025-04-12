const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'website_created',
            'website_updated',
            'website_deleted',
            'content_created',
            'content_updated',
            'content_deleted',
            'user_created',
            'user_updated',
            'user_deleted',
            'role_changed',
            'login',
            'logout',
            'api_request',
            'settings_updated',
            'permission_updated'
        ]
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'error', 'warning', 'info']
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    affectedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    affectedWebsite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    affectedContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ affectedUser: 1, createdAt: -1 });
activityLogSchema.index({ affectedWebsite: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog; 