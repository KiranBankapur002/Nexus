const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user; // Attach user object to the request
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = authenticateJWT;
