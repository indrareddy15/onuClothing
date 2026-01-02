import winston from 'winston';
import dotenv from 'dotenv';
import DailyRotateFile from 'winston-daily-rotate-file';

// Load environment variables from.env file
dotenv.config();

const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';


const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} ${level}: ${message} - ${stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
});

// Logger configuration
const logger = winston.createLogger({
    level: logLevel,  // Set default log level
    format: combine(
        timestamp(),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Console transport (only for development or when needed in production)
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                logFormat
            )
        }),
        new DailyRotateFile({
            filename: 'logs/OnU-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: logLevel,  // Adjust level for production
            maxSize: '20m',
            maxFiles: '14d', // Keep logs for 14 days
        }),
        new DailyRotateFile({
            filename: 'logs/OnU-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: logLevel, // Only log errors to this file
            maxSize: '20m',
            maxFiles: '14d',
        })
    ]
});

// Export the logger for use in other parts of the application
export default logger;
