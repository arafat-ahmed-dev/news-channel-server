import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
    role: {
      type: String,
      enum: {
        values: ['reader', 'editor', 'admin', 'superadmin'],
        message: 'Role must be reader, editor, admin, or superadmin',
      },
      default: 'reader',
    },
    // isEmailVerified removed
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
    // emailVerificationToken and emailVerificationExpiry removed
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.forgetPasswordToken;
        delete ret.forgetPasswordExpiry;
        // emailVerificationToken and emailVerificationExpiry removed
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance (email unique is already defined in schema)
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });

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
      role: this.role,
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
