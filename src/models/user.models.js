import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';

// Zod validation schema
export const userValidationSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
      invalid_type_error: 'Full name must be a string',
    })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 characters'),

  avatar: z.string().url('Avatar must be a valid URL').optional(),

  status: z.enum(['active', 'inactive', 'suspended']).default('active'),

  isEmailVerified: z.boolean().default(false),
});

// Registration schema (subset of user schema)
export const registrationSchema = userValidationSchema.pick({
  fullName: true,
  email: true,
  username: true,
  password: true,
});

// Helper function to validate user registration data
export const validateUserRegistration = (userData) => {
  return registrationSchema.safeParse(userData);
};

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      index: true,
    },
    avatar: {
      type: String,
      default:
        'https://img.icons8.com/?size=200&id=98957&format=png&color=000000',
    },
    localPath: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'suspended'],
        message: 'Status must be active, inactive, or suspended',
      },
      default: 'active',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    forgetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    forgetPasswordExpiry: {
      type: Date,
      default: null,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.forgetPasswordToken;
        delete ret.emailVerificationToken;
        delete ret.forgetPasswordExpiry;
        delete ret.emailVerificationExpiry;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Compound indexes for better query performance
userSchema.index({ email: 1, isEmailVerified: 1 });
userSchema.index({ email: 1, username: 1 });

userSchema.index({ username: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashToken = crypto.randomBytes(16).toString('hex');

  const hashToken = crypto
    .createHash('sha256')
    .update(unHashToken)
    .digest('hex');

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes
  return { hashToken, unHashToken, tokenExpiry };
};

const User = mongoose.model('User', userSchema);

export default User;
