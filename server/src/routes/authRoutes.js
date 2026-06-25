const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateMessageTemplate,
  updateTheme,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/message-template', protect, updateMessageTemplate);
router.put('/theme', protect, updateTheme);

module.exports = router;
