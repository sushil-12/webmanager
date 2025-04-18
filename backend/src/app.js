const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedUserRoutes');
const subscribtionApis = require('./routes/subscribtionApis');
const commonRoutes = require('./routes/commanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { CustomError, ErrorHandler, ResponseHandler } = require('./utils/responseHandler');
const connectDB = require('./config/database');
const useragent = require('express-useragent');
const cors = require('cors');
const corsOptions = require("./constants/cors");
const { HTTP_STATUS_CODES } = require('./constants/error_message_codes');
const basicAuth = require('express-basic-auth');
const path = require('path');
const fs = require('fs');
const serveIndex = require('serve-index');
const sanitizeInput = require('./middleware/sanitizeRequest');
const rateLimit = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const apiUsageLogger = require('./middleware/apiUsageLogger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');
const validateApiKey = require('./middleware/validateApiKey');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Too many requests, please try again later.'
    },
    headers: true, // Send rate limit header info
});

// Middleware
const app = express();
app.use(express.json({ limit: '250kb' }));  // Set payload size to 150kb
app.use(express.urlencoded({ limit: '250kb', extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(sanitizeInput);
app.use(useragent.express());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Applying the rate limiter to all requests
// app.use(limiter);

// Ensure the /tmp/logs directory exists
const logDir = path.join('/tmp', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Basic authentication for logs
app.use('/logs', basicAuth({
    users: { 'admin': process.env.PASSWORD_BACKEND }, // Replace with your username and password
    challenge: true,
    unauthorizedResponse: (req) => 'Unauthorized'
}));

// Serve the logs directory publicly with file listing
app.use('/logs', express.static(logDir), serveIndex(logDir, { icons: true }));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));

// Authentication routes
app.use('/api/auth', authRoutes);

// Dashboard routes with authentication and API usage logging
app.use('/api/dashboard', dashboardRoutes);

// Common routes
app.use('/api/common', commonRoutes);
app.use('/subscription-api', subscribtionApis);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// Protected routes with authentication and API usage logging
app.use('/api', [authMiddleware.verifyToken, apiUsageLogger], protectedRoutes);

// Subscription API routes with API key validation and usage logging

// Configure raw body parsing for Stripe webhooks

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});

// SVG upload route
app.post('/upload/svg', (req, res) => {
    const { name, code } = req.body;
    const currentJson = path.join(__dirname, 'constants', 'svg_codes.json');
    if (!name || !code) {
        return res.status(400).json({ error: 'SVG name and code are required' });
    }

    // Read the existing JSON file
    fs.readFile(currentJson, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let svgData = {};
        try {
            // Parse the existing JSON content
            svgData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing JSON');
        }

        // Append the new SVG data
        svgData[name] = code;

        const jsonString = JSON.stringify(svgData, null, 2);

        // Write back to the JSON file
        fs.writeFile(currentJson, jsonString, (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }
            ResponseHandler.success(res, { message: 'SVG Added Successfully' }, HTTP_STATUS_CODES.CREATED);
        });
    });
});

// 404 Error Handler
app.use((req, res, next) => {
    ErrorHandler.handleNotFound(res);
});

// Generic Error Handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
