const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getSummary,
    getByCategory,
    getTrend,
    getInsights,
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/trend', getTrend);
router.get('/insights', getInsights);

module.exports = router;
