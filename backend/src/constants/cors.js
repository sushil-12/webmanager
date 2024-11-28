require('dotenv').config();

const frontendUrl = process.env.FRONTEND_APP_URL.replace(/\/$/, '');

var originsWhitelist = [
    frontendUrl,
    'http://localhost:5173',
    'https://webmanager-client.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || originsWhitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.log('origin:', origin, 'not allowed');
            callback(new Error('Not allowed by CORS'));
        }
    }
};

module.exports = corsOptions;