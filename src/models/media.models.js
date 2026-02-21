import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: [true, 'Type is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    usage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

MediaSchema.index({ type: 1 });
MediaSchema.index({ createdAt: -1 });

export default mongoose.model('Media', MediaSchema);
