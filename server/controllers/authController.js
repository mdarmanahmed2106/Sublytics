const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

// ── Token Helpers ──

const generateAccessToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });

const generateRefreshToken = (id) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });

const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
    });
};

// ── Validation Rules ──

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// ── Controllers ──

// @desc    Register a new user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR');
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('An account with this email already exists', 400, 'EMAIL_EXISTS');
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    sendSuccess(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
    }, 201);
});

// @desc    Login user & get tokens
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR');
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    sendSuccess(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
    });
});

// @desc    Refresh access token using refresh cookie
// @route   POST /api/auth/refresh
const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new AppError('No refresh token', 401, 'NO_TOKEN');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
    }

    const accessToken = generateAccessToken(user._id);
    // Rotate refresh token
    const newRefreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, newRefreshToken);

    sendSuccess(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
    });
});

// @desc    Logout — clear refresh cookie
// @route   POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0),
        path: '/',
    });

    sendSuccess(res, { message: 'Logged out successfully' });
});

module.exports = {
    register,
    login,
    refreshAccessToken,
    logoutUser,
    registerValidation,
    loginValidation,
};
