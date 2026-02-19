const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: { code: 'USER_NOT_FOUND', message: 'User no longer exists' },
                });
            }
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' },
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: { code: 'NO_TOKEN', message: 'Not authorized, no token provided' },
        });
    }
};

module.exports = { protect };
