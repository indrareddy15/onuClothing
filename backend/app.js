import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import adminRoute from './routes/adminRoutes/admin.route.js';
import commonRoute from './routes/common.Routes/common.routes.js';
import User from './routes/userroutes.js';
import Product from './routes/productroute.js';
import Order from './routes/orderroutes.js';
import paymentRoutes from './routes/payment.route.js';
import razorPayRoute from './routes/razorPayPayment.route.js';
import shipRocketHookRoute from './routes/logisticRoutes.js';
import errorMiddleware from './Middelwares/error.js';

// Fix for TLS certificate issues with Cloudinary uploads
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for development - use proper certificates in production

const app = express();

app.use(express.json({ limit: process.env.MAX_JSON_LIMIT || '100mb' }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ limit: process.env.MAX_URLENCODED_LIMIT || '100mb', extended: true }));

// Allowed origins (ensure these are correct)
const allowedOrigins = [
    process.env.API_URL,        // e.g. https://api.theonu.in
    process.env.CLIENT_URL,     // e.g. https://theonu.in
    process.env.CLIENT_URL_ADMIN, // e.g. https://admin.theonu.in
];

// Debug CORS origins in development
if (process.env.NODE_ENV === 'development') {
    console.log('🌐 CORS Allowed Origins:', allowedOrigins);
}

app.use(
    cors({
        origin: (origin, callback) => {
            console.log('🔍 CORS Request Origin:', origin); // Debug log

            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS Allowed:', origin);
                callback(null, true);
            } else {
                console.log('❌ CORS Blocked:', origin);
                console.log('📝 Allowed origins:', allowedOrigins);
                callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
            'x-forwarded-for',
            'Accept',
            'Origin',
            'X-Requested-With'
        ],
        credentials: true, // Allow credentials like cookies
    })
);

// Handling OPTIONS requests for preflight CORS
app.options('*', cors());

// Add payload limit error handler with CORS headers
app.use((err, req, res, next) => {
    if (err.status === 413 || err.message?.includes('payload')) {
        return res.status(413).json({
            Success: false,
            message: 'Payload too large. Maximum file size is 50MB per file or 100MB total.'
        });
    }
    next(err);
});


// Define the / route to send a JSON response
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the On U API. The server is running!' });
});

// Define the other routes
app.use('/admin', adminRoute);
app.use('/api/common', commonRoute);
app.use('/api/auth', User);
app.use('/api/shop/products', Product);
app.use('/api/shop/order_bag_wishList', Order);
app.use('/api/payment', paymentRoutes);
app.use('/api/payment/razorpay', razorPayRoute);
app.use('/api/logistic', shipRocketHookRoute);

// Error handling middleware (must be registered last)
app.use(errorMiddleware);

export default app;
