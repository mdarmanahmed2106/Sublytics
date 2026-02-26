const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    markSubscriptionUsed,
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

router.patch('/:id/mark-used', markSubscriptionUsed);

module.exports = router;
