import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
// sendVerifyEmail import removed
import {
  validateUserRegistration,
  validateUserLogin,
} from '../validators/user.validator.js';

const generateAuthorizationTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate authorization tokens');
  }
};

const register = asyncHandler(async (req, res) => {
  // Check if req.body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(
      400,
      'Request body is missing or empty. Please ensure you are sending data as JSON with Content-Type: application/json header.',
    );
  }

  const { fullName, email, password } = req.body;

  // Validate user data with Zod
  const validationResult = validateUserRegistration({
    fullName,
    email,
    password,
  });

  if (!validationResult.success) {
    const errorMessages =
      validationResult.error && validationResult.error.errors
        ? validationResult.error.errors.map(
            (err) => `${err.path.join('.')}: ${err.message}`,
          )
        : ['Invalid input data'];
    throw new ApiError(400, errorMessages.join(', '));
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new ApiError(409, 'User with this email already exists');
  }
  const newUser = await User.create({
    fullName,
    email,
    password,
  });
  if (!newUser) {
    throw new ApiError(500, 'Failed to create user');
  }
  // Email verification logic removed

  const { accessToken, refreshToken } = await generateAuthorizationTokens(
    newUser._id,
  );
  newUser.refreshToken = refreshToken;

  await newUser.save({ validateBeforeSave: false });
  // Email verification sending removed

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: newUser,
        accessToken,
        refreshToken,
      },
      'User registered successfully',
    ),
  );
});

const login = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(
      400,
      'Request body is missing or empty. Please ensure you are sending data as JSON with Content-Type: application/json header.',
    );
  }

  const { email, password } = req.body;

  const validationResult = validateUserLogin({ email, password });
  if (!validationResult.success) {
    const errorMessages =
      validationResult.error && validationResult.error.errors
        ? validationResult.error.errors.map(
            (err) => `${err.path.join('.')}: ${err.message}`,
          )
        : ['Invalid input data'];
    throw new ApiError(400, errorMessages.join(', '));
  }

  const user = await User.findOne({ email }).select('+refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User is not active');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAuthorizationTokens(
    user._id,
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        accessToken,
        refreshToken,
      },
      'User logged in successfully',
    ),
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken: incomingRefreshToken } = req.body;

  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Refresh token is required.');
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Refresh token has expired. Please login again.');
    }
    throw new ApiError(401, 'Invalid refresh token.');
  }

  const user = await User.findById(decoded._id).select('+refreshToken');

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token. User not found.');
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token has been revoked.');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Account is not active.');
  }

  const { accessToken, refreshToken } = await generateAuthorizationTokens(
    user._id,
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
      },
      'Token refreshed successfully',
    ),
  );
});

export { register, login, refreshAccessToken };
