const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// ── Logging ──
app.use(requestLogger);

// ── Rate Limiting ──
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// ── Routes ──
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

// ── Health Check ──
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Sublytics API is running' });
});

// ── Centralized Error Handler ──
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
