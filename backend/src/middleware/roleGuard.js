function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.member || !allowedRoles.includes(req.member.role)) {
      return res.status(401).json({
        success: false,
        message: 'Admin access is required'
      });
    }
    next();
  };
}

module.exports = roleGuard;
