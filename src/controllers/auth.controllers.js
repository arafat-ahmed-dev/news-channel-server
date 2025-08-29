import User, { validateUserRegistration } from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendVerifyEmail } from '../utils/mail.js';

const generateAuthorizationTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError('Failed to generate authorization tokens', 500);
  }
};

const register = asyncHandler(async (req, res) => {
  // Check if req.body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(
      'Request body is missing or empty. Please ensure you are sending data as JSON with Content-Type: application/json header.',
      400,
    );
  }

  const { username, fullName, email, password } = req.body;

  // Validate user data with Zod
  const validationResult = validateUserRegistration({
    username,
    fullName,
    email,
    password,
  });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`,
    );
    throw new ApiError(errorMessages.join(', '), 400);
  }

  const isUserExists = await User.findOne({ $or: [{ email }, { username }] });
  if (isUserExists) {
    throw new ApiError('User with this email or username already exists', 409);
  }
  const newUser = await User.create({
    username,
    fullName,
    email,
    password,
  });
  if (!newUser) {
    throw new ApiError('Failed to create user', 500);
  }
  const { hashToken, unHashToken, tokenExpiry } =
    newUser.generateTemporaryToken();
  newUser.emailVerificationToken = hashToken;
  newUser.emailVerificationExpiry = tokenExpiry;

  const { accessToken, refreshToken } = await generateAuthorizationTokens(
    newUser._id,
  );
  newUser.refreshToken = refreshToken;

  await newUser.save({ validateBeforeSave: false });
  const urlGenerate = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${unHashToken}`;
  await sendVerifyEmail(newUser.email, urlGenerate, newUser.fullName);

  res.status(201).json(
    new ApiResponse(201, 'User registered successfully', {
      user: newUser,
      accessToken,
      refreshToken,
    }),
  );
});

export { register };
