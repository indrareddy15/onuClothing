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

// Fix for TLS certificate issues with Cloudinary uploads
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for development - use proper certificates in production

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ limit: '10mb', extended: true }));

// Allowed origins (ensure these are correct)
const allowedOrigins = [
    process.env.API_URL,        // e.g. https://api.theonu.in
    process.env.CLIENT_URL,     // e.g. https://theonu.in
    process.env.CLIENT_URL_ADMIN, // e.g. https://admin.theonu.in
    'http://localhost:3000',    // Frontend development server
    'http://localhost:3001',
    'http://localhost:5173',    // Vite default dev server
    'http://localhost:5174',    // Admin frontend dev server
    'http://localhost:5176',    // Admin frontend dev server
    'http://localhost:5175',    // Admin frontend dev server
    'http://127.0.0.1:3000',    // Alternative localhost
    'http://127.0.0.1:5173',    // Alternative localhost
    'http://127.0.0.1:5174',    // Alternative localhost
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



export default app;
