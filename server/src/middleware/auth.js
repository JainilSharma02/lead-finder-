const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Mock user for open access (no auth barrier)
    const mockUserId = '111111111111111111111111'; 
    let user = await User.findById(mockUserId);
    
    if (!user) {
      user = await User.create({
        _id: mockUserId,
        name: 'Guest User',
        email: 'guest@leadfinder.pro',
        password: 'Password123!',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please log in again', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };
