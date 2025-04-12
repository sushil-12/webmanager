const ApiUsageLog = require('../models/ApiUsageLog');
const UserSubscription = require('../models/UserSubscription');

const apiUsageLogger = (req, res, next) => {
    const startTime = Date.now();
    const originalEnd = res.end;
    const originalJson = res.json;

    // Capture response data
    let responseBody;
    res.json = function(data) {
        responseBody = data;
        return originalJson.call(this, data);
    };

    // Override end to log after response is sent
    res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        const status = res.statusCode >= 400 ? 'error' : 'success';

        // Log usage asynchronously without awaiting
        const logUsage = async () => {
            try {
                // Get user subscription from request
                const userSubscription = req.userSubscription;
                const userId = req.user?._id || userSubscription?.userId?._id;

                if (userId) {
                    // Log API usage
                    await ApiUsageLog.logUsage({
                        userId,
                        websiteId: req.params.websiteId || req.body.websiteId,
                        endpoint: req.originalUrl,
                        method: req.method,
                        status,
                        responseTime,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent'],
                        errorDetails: status === 'error' ? responseBody : undefined,
                        metadata: {
                            query: req.query,
                            params: req.params,
                            statusCode: res.statusCode
                        }
                    });

                    // Increment API calls count if it's a subscription-based request
                    if (userSubscription) {
                        await userSubscription.incrementApiCalls();
                    }
                }
            } catch (error) {
                console.error('Error logging API usage:', error);
            }
        };

        logUsage();

        originalEnd.apply(this, args);
    };

    next();
};

module.exports = apiUsageLogger;
