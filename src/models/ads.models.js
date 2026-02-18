import mongoose from 'mongoose';

const AdsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    type: {
      type: String,
      enum: ['banner', 'sidebar', 'inline', 'video'],
      default: 'banner',
    },
    placement: {
      type: String,
      required: [true, 'Placement is required'],
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'scheduled'],
      default: 'active',
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      required: [true, 'End date is required'],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Ads', AdsSchema);
