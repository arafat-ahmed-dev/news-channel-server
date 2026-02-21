import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

/**
 * Verify JWT access token and attach user to req.user
 */
export const verifyToken = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === 'undefined' || token === 'null') {
    throw new ApiError(401, 'Access denied. Token is empty or invalid.');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      '-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid token. User not found.');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account is not active.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, `Invalid token: ${error.message}`);
    }
    if (error.name === 'NotBeforeError') {
      throw new ApiError(401, 'Token is not yet active.');
    }
    throw new ApiError(401, 'Authentication failed.');
  }
});

/**
 * Require specific roles. Must be used AFTER verifyToken.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'editor')
 */
export const requireRole = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role(s): ${roles.join(', ')}.`,
      );
    }

    next();
  };
};

/**
 * Shorthand: verify token + require admin/superadmin
 */
export const requireAdmin = [verifyToken, requireRole('admin', 'superadmin')];

/**
 * Shorthand: verify token + require editor/admin/superadmin
 */
export const requireEditor = [
  verifyToken,
  requireRole('editor', 'admin', 'superadmin'),
];
