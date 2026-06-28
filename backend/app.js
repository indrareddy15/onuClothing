import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import adminRoute from './routes/adminRoutes/admin.route.js';
import commonRoute from './routes/common.Routes/common.routes.js';
import User from './routes/userroutes.js';
import Product from './routes/productroute.js';
import Order from './routes/orderroutes.js';
import paymentRoutes from './routes/payment.route.js';
import razorPayRoute from './routes/razorPayPayment.route.js';
import shipRocketHookRoute from './routes/logisticRoutes.js';
import errorMiddleware from './Middelwares/error.js';

// Fix for TLS certificate issues (Only for development)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

app.use(express.json({ limit: process.env.MAX_JSON_LIMIT || '100mb' }));
app.use(cookieParser());
app.use(
    bodyparser.urlencoded({
        limit: process.env.MAX_URLENCODED_LIMIT || '100mb',
        extended: true,
    })
);

const allowedOrigins = [
    process.env.API_URL,
    ...(process.env.CLIENT_URL || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean),
    process.env.CLIENT_URL_ADMIN,
].filter(Boolean);

console.log('====================================');
console.log('🌐 Allowed Origins');
console.log(allowedOrigins);
console.log('====================================');

/**
 * ==========================================
 * CORS Configuration
 * ==========================================
 */

app.use(
    cors({
        origin: (origin, callback) => {
            console.log('🔍 Request Origin:', origin);

            // Allow Postman, Mobile Apps, Server-to-Server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS Allowed:', origin);
                return callback(null, true);
            }

            console.log('❌ CORS Blocked:', origin);
            console.log('📋 Allowed Origins:', allowedOrigins);

            return callback(new Error(`Origin ${origin} is not allowed by CORS`));
        },

        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

        credentials: true,

        allowedHeaders: [
            'Origin',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
            'Pragma',
            'Expires',
            'X-Requested-With',
            'x-forwarded-for',
        ],
    })
);

// Handle Preflight Requests
app.options('*', cors());

/**
 * Payload Too Large Handler
 */

app.use((err, req, res, next) => {
    if (err.status === 413 || err.message?.includes('payload')) {
        return res.status(413).json({
            Success: false,
            message:
                'Payload too large. Maximum file size is 50MB per file or 100MB total.',
        });
    }

    next(err);
});

/**
 * Root Route
 */

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the On U API. Server is running successfully.',
    });
});

/**
 * Routes
 */

app.use('/admin', adminRoute);
app.use('/api/common', commonRoute);
app.use('/api/auth', User);
app.use('/api/shop/products', Product);
app.use('/api/shop/order_bag_wishList', Order);
app.use('/api/payment', paymentRoutes);
app.use('/api/payment/razorpay', razorPayRoute);
app.use('/api/logistic', shipRocketHookRoute);

/**
 * Global Error Handler
 */

app.use(errorMiddleware);

export default app;