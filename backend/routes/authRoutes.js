const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk registrasi
router.post('/register', authController.register);

// Route untuk login
router.post('/login', authController.login);

// Route untuk verifikasi OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;