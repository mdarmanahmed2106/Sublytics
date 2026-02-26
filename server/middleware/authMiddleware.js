const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check Authorization header first, then cookie fallback
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.refreshToken) {
        // For backward compat — but prefer bearer token
        token = null; // Don't use refresh as access
    }

    if (!token) {
        throw new AppError('Not authorized, no token provided', 401, 'NO_TOKEN');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
    }

    next();
});

module.exports = { protect };
