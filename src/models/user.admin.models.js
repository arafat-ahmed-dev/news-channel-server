import mongoose from 'mongoose';

const userAdminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: {
        values: ['admin', 'editor', 'author', 'subscriber'],
        message: 'Role must be admin, editor, author, or subscriber',
      },
      default: 'subscriber',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be active or inactive',
      },
      default: 'active',
    },
    articles: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('UserAdmin', userAdminSchema);
