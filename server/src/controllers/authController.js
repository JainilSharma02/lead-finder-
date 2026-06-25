const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/token');
const { sendPasswordResetEmail } = require('../services/emailService');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are all required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateAccessToken(user._id);

    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateAccessToken(user._id);
    res.json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });

    // Always respond with success to avoid leaking which emails are registered
    const genericResponse = {
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({ to: user.email, resetUrl, name: user.name });
    } catch (emailErr) {
      // Don't fail the request just because SMTP isn't configured in dev;
      // log it so the developer can grab the token/link from the server console instead.
      console.warn('Email send failed (this is expected if SMTP is not configured):', emailErr.message);
      console.warn('Password reset URL (dev fallback):', resetUrl);
    }

    res.json(genericResponse);
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateAccessToken(user._id);
    res.json({ success: true, message: 'Password updated successfully', token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/message-template
const updateMessageTemplate = async (req, res, next) => {
  try {
    const { messageTemplate } = req.body;
    if (typeof messageTemplate !== 'string' || !messageTemplate.trim()) {
      return res.status(400).json({ success: false, message: 'Message template cannot be empty' });
    }

    req.user.messageTemplate = messageTemplate;
    await req.user.save();

    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/theme
const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Theme must be "light" or "dark"' });
    }
    req.user.theme = theme;
    await req.user.save();
    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateMessageTemplate,
  updateTheme,
};
