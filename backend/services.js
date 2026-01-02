import App from './app.js';
import connectdatabse from './database/Database.js';
import { config } from 'dotenv';
import logger from './utility/loggerUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
config({ path: path.join(__dirname, '../.env') });

// Debug environment variables in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Variables Loaded:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   PORT: ${process.env.PORT}`);
    console.log(`   API_URL: ${process.env.API_URL}`);
    console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`);
    console.log(`   CLIENT_URL_ADMIN: ${process.env.CLIENT_URL_ADMIN}`);
    console.log(`   DB_URI: ${process.env.DB_URI ? 'Connected' : 'Not Set'}`);
}

process.on('uncaughtException', (err) => {
    logger.error(`Shutting down server due to uncaught Exception: ${err.message}`);
    console.log(`shutting down server due to uncaught Exception`)
    process.exit(1)
})
const PORT = process.env.PORT || 8004;
let server = null
connectdatabse().then(() => {
    server = App.listen(PORT, () => {
        console.log(`Server running on ${process.env.API_URL}`)
    })
})

process.on('unhandledRejection', (err) => {
    logger.error(`Shutting down server due to unhandled promise rejection: ${err.message}`);
    console.log(`shutting down server due unhandled promise rejection`, err);

    server.close(() => {
        process.exit(1);
    })
})

