const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'substracker-api' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : '';
                    return `${timestamp} [${level}]: ${message}${metaStr}`;
                })
            ),
        }),
    ],
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.File({
        filename: path.join(__dirname, '..', 'logs', 'error.log'),
        level: 'error',
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
    }));
    logger.add(new transports.File({
        filename: path.join(__dirname, '..', 'logs', 'combined.log'),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
    }));
}

module.exports = logger;
