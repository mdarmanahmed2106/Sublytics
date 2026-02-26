const rateLimit = require('express-rate-limit');

// Strict limiter for auth routes (login/register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 15 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT',
            message: 'Too many attempts, please try again after 15 minutes',
        },
    },
});

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT',
            message: 'Too many requests, please slow down',
        },
    },
});

module.exports = { authLimiter, apiLimiter };
