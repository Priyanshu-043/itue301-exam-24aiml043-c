const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

async function authGuard(req, res, next) {
  try {
    const header = req.get('Authorization');

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }

    const token = header.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bearer token is missing'
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findById(payload.memberId).select('-__v');

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Member associated with token was not found'
      });
    }

    if (payload.role && payload.role !== member.role) {
      return res.status(401).json({
        success: false,
        message: 'Token role is no longer valid'
      });
    }

    req.member = member;
    req.role = member.role;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    next(err);
  }
}

module.exports = authGuard;
