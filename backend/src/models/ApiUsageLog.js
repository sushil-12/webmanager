const mongoose = require('mongoose');

const apiUsageLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'error']
    },
    responseTime: {
        type: Number, // in milliseconds
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    errorDetails: {
        type: mongoose.Schema.Types.Mixed
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for faster queries
apiUsageLogSchema.index({ userId: 1, timestamp: -1 });
apiUsageLogSchema.index({ websiteId: 1, timestamp: -1 });
apiUsageLogSchema.index({ endpoint: 1, timestamp: -1 });
apiUsageLogSchema.index({ status: 1, timestamp: -1 });
apiUsageLogSchema.index({ timestamp: 1 });

// Method to log API usage
apiUsageLogSchema.statics.logUsage = async function(logData) {
    const log = new this(logData);
    await log.save();
    return log;
};

// Method to get usage summary
apiUsageLogSchema.statics.getUsageSummary = async function(userId, period = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const summary = await this.aggregate([
        {
            $match: {
                userId,
                timestamp: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    status: "$status"
                },
                count: { $sum: 1 },
                avgResponseTime: { $avg: "$responseTime" }
            }
        },
        {
            $group: {
                _id: "$_id.date",
                total: { $sum: "$count" },
                success: {
                    $sum: {
                        $cond: [{ $eq: ["$_id.status", "success"] }, "$count", 0]
                    }
                },
                error: {
                    $sum: {
                        $cond: [{ $eq: ["$_id.status", "error"] }, "$count", 0]
                    }
                },
                avgResponseTime: { $avg: "$avgResponseTime" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    return summary;
};

const ApiUsageLog = mongoose.model('ApiUsageLog', apiUsageLogSchema);

module.exports = ApiUsageLog; 