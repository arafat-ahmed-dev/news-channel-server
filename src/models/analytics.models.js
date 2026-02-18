import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    uniqueUsers: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
    },
    avgSessionDuration: {
      type: Number,
      default: 0,
    },
    topCountries: [
      {
        country: String,
        users: Number,
        percentage: Number,
      },
    ],
    topDevices: [
      {
        device: String,
        users: Number,
        percentage: Number,
      },
    ],
    topArticles: [
      {
        title: String,
        views: Number,
        avgTime: Number,
      },
    ],
    topCategories: [
      {
        category: String,
        views: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Analytics', AnalyticsSchema);
