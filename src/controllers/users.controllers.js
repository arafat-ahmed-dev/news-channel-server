import User from '../models/user.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all users (admin panel — excludes sensitive fields)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const safePage = Math.max(1, parseInt(page) || 1);
  const skip = (safePage - 1) * safeLimit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(
        '-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry',
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
      'Users fetched successfully',
    ),
  );
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId)
    .select(
      '-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry',
    )
    .lean();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

// Create user (admin creates editors/admins)
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, 'Full name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: role || 'reader',
  });

  // Return without sensitive fields
  const { password: _, refreshToken: __, ...safeUser } = user.toObject();

  return res
    .status(201)
    .json(new ApiResponse(201, safeUser, 'User created successfully'));
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, role, status } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (role) user.role = role;
  if (status) user.status = status;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User updated successfully'));
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User deleted successfully'));
});

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
