const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let code = (typeof err.code === 'string' && err.code) || 'SERVER_ERROR';
    let message = err.message || 'Internal server error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = 'Invalid resource ID';
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        code = 'DUPLICATE_KEY';
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for ${field}`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token has expired';
    }

    // Log server errors
    if (statusCode >= 500) {
        logger.error(`${statusCode} - ${message}`, {
            path: req.originalUrl,
            method: req.method,
            stack: err.stack,
        });
    } else {
        logger.warn(`${statusCode} - ${message}`, {
            path: req.originalUrl,
            method: req.method,
        });
    }

    res.status(statusCode).json({
        success: false,
        error: { code, message },
    });
};

module.exports = errorHandler;
