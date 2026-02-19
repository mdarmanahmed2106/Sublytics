const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    subscriptionValidation,
} = require('../controllers/subscriptionController');

router.use(protect);

router.route('/')
    .get(getSubscriptions)
    .post(subscriptionValidation, createSubscription);

router.route('/:id')
    .get(getSubscription)
    .put(updateSubscription)
    .delete(deleteSubscription);

module.exports = router;
