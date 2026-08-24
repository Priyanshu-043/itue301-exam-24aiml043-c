function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}`
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return res.status(400).json({
      success: false,
      message: `Duplicate value for: ${fields.join(', ') || 'unique field'}`
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

module.exports = errorHandler;
