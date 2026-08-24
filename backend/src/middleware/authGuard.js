const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

async function authGuard(req, res, next) {
  try {
    const header = req.get('Authorization');
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authorization token is required' });
    const token = header.slice(7).trim();
    if (!token) return res.status(401).json({ success: false, message: 'Bearer token is missing' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const Model = payload.userType === 'Trainer' ? Trainer : Member;
    const query = Model.findById(payload.userId).select(payload.userType === 'Trainer' ? '-__v' : '-__v');
    if (payload.userType === 'Trainer') query.select('+passwordHash');
    const user = await query;

    if (!user) return res.status(401).json({ success: false, message: 'User associated with token was not found' });
    const currentRole = payload.userType === 'Trainer' ? 'Trainer' : user.role;
    if (payload.role !== currentRole) return res.status(401).json({ success: false, message: 'Token role is no longer valid' });

    user.role = currentRole;
    req.member = user;
    req.role = currentRole;
    req.userType = payload.userType;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    next(err);
  }
}

module.exports = authGuard;
