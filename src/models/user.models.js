import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import validator from 'validator';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
      validate: {
        validator: function (name) {
          return /^[a-zA-Z\s]+$/.test(name);
        },
        message: 'Full name can only contain letters and spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      index: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      validate: {
        validator: function (username) {
          return /^[a-zA-Z0-9_]+$/.test(username);
        },
        message: 'Username can only contain letters, numbers, and underscores',
      },
    },
    avatar: {
      type: String,
      default:
        'https://img.icons8.com/?size=200&id=98957&format=png&color=000000',
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url);
        },
        message: 'Avatar must be a valid URL',
      },
    },
    localPath: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Hide password by default in queries
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
      validate: {
        validator: function (date) {
          return !date || date > new Date();
        },
        message: 'Password reset expiry must be in the future',
      },
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
      validate: {
        validator: function (date) {
          return !date || date > new Date();
        },
        message: 'Email verification expiry must be in the future',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (ret) {
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

// Compound indexes for better query performance
userSchema.index({ email: 1, isEmailVerified: 1 });
userSchema.index({ username: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
