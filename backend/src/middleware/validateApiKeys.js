const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../constants/error_message_codes');
const { ResponseHandler } = require('../utils/responseHandler');

/**
 * Middleware to validate API keys.
 */
const validateApiKey = (req, res, next) => {
    try {
        // Extract the API key from query parameters or headers
        const apiKey = req.query.api_key || req.headers['x-api-key'];

        if (!apiKey) {
            // Return error response if no API key is provided
            return ResponseHandler.error(
                res,
                HTTP_STATUS_CODES.UNAUTHORIZED,
                { message: 'Missing API Key' },
                HTTP_STATUS_CODES.UNAUTHORIZED
            );
        }

        // Validate the API key against a predefined key or a list of keys
        const validApiKeys = process.env.VALID_API_KEYS
            ? process.env.VALID_API_KEYS.split(',')
            : [];
        if (!validApiKeys.includes(apiKey)) {
            // Return error response if the API key is invalid
            return ResponseHandler.error(
                res,
                HTTP_STATUS_CODES.UNAUTHORIZED,
                { message: HTTP_STATUS_MESSAGES.INVALID_API_KEY || 'Invalid API Key' },
                HTTP_STATUS_CODES.UNAUTHORIZED
            );
        }

        // Attach the API key to the request object (optional)
        req.apiKey = apiKey;

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        // Pass unexpected errors to the error-handling middleware
        next(error);
    }
};

module.exports = validateApiKey;