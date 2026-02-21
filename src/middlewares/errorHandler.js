// Centralized error handler middleware
export default function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  // Log the full error in all environments
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${statusCode}`,
    {
      message: err.message,
      ...(isDev && { stack: err.stack }),
    },
  );

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default response — hide details in production
  res.status(statusCode).json({
    success: false,
    message: isDev ? err.message : 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
}
