const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshAccessToken,
    logoutUser,
    registerValidation,
    loginValidation,
} = require('../controllers/authController');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

module.exports = router;
