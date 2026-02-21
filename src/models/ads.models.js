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
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
  },
  {
    timestamps: true,
  },
);

AdsSchema.index({ status: 1, placement: 1 });
AdsSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model('Ads', AdsSchema);
