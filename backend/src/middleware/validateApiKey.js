const { CustomError } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/error_message_codes');
const Subscription = require('../models/Subscription');
const ApiUsageLog = require('../models/ApiUsageLog');

const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.api_key || req.headers['x-api-key'];
        if (!apiKey) {
            console.log("API KEY IS REQUIRED");
            throw new CustomError('API key is required', HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        // Check if it's the superadmin API key
        if (apiKey === process.env.SUPERADMIN_API_KEY) {
            req.isSuperAdmin = true;
            return next();
        }

        // Find active subscription with this API key
        const subscription = await Subscription.findByApiKey(apiKey);
        
        if (!subscription) {
            throw new CustomError('Invalid or expired API key', HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        // Validate the API key
        const isValid = subscription.validateApiKey(apiKey);
        if (!isValid) {
            throw new CustomError('Invalid API key', HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        // Check API usage limits
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const apiCallsToday = await ApiUsageLog.countDocuments({
            userId: subscription.userId,
            timestamp: { $gte: today }
        });

        if (apiCallsToday >= subscription.planId.apiCallsLimit) {
            throw new CustomError('API call limit exceeded', HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        }

        // Add subscription and user info to request
        req.subscription = subscription;
        req.userId = subscription.userId;

        console.log("API KEY IS VALID", "usagelog");
        // Log API usage
        const apiUsageLog = new ApiUsageLog({
            userId: subscription.userId,
            subscriptionId: subscription._id,
            apiKey: apiKey,
            endpoint: req.originalUrl,
            method: req.method,
            timestamp: new Date(),
            status: 'success',
            responseTime: 0, // Will be updated after response
            metadata: {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                queryParams: req.query,
                body: req.body
            }
        });

        // Save the initial log
        await apiUsageLog.save();

        // Store the log ID in the request for later update
        req.apiUsageLogId = apiUsageLog._id;

        // Add response time tracking
        const startTime = Date.now();
        res.on('finish', async () => {
            try {
                const responseTime = Date.now() - startTime;
                await ApiUsageLog.findByIdAndUpdate(req.apiUsageLogId, {
                    responseTime,
                    status: res.statusCode < 400 ? 'success' : 'error'
                });

                // Update subscription's API usage count
                await Subscription.findByIdAndUpdate(subscription._id, {
                    $inc: { apiCallsUsed: 1 }
                });
            } catch (error) {
                console.error('Error updating API usage log:', error);
            }
        });
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateApiKey; 