const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getSummary,
    getByCategory,
    getTrend,
    getHealthScore,
    getSmartInsights,
    getSpendingSpike,
    simulateCancel,
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/trend', getTrend);
router.get('/health-score', getHealthScore);
router.get('/smart-insights', getSmartInsights);
router.get('/spending-spike', getSpendingSpike);
router.post('/simulate-cancel', simulateCancel);

module.exports = router;
