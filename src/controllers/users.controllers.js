import UserAdmin from '../models/user.admin.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserAdmin.find();
  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await UserAdmin.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

// Create user
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, role } = req.body;

  if (!fullName || !email || !role) {
    throw new ApiError(400, 'Full name, email, and role are required');
  }

  const existingUser = await UserAdmin.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = new UserAdmin({
    fullName,
    email,
    role,
  });

  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User created successfully'));
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, role, status } = req.body;

  const user = await UserAdmin.findById(userId);
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

  const user = await UserAdmin.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User deleted successfully'));
});

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
