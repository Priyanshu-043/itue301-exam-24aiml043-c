function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(401).json({ success: false, message: 'You do not have permission to access this resource' });
    }
    next();
  };
}
module.exports = roleGuard;
