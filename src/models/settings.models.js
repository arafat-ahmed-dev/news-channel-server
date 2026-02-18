import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    siteInfo: {
      siteName: { type: String, default: '' },
      siteDescription: { type: String, default: '' },
      siteUrl: { type: String, default: '' },
      contactEmail: { type: String, default: '' },
      phoneNumber: { type: String, default: '' },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      commentNotifications: { type: Boolean, default: true },
      reportingNotifications: { type: Boolean, default: true },
    },
    publishing: {
      moderateComments: { type: Boolean, default: true },
      autoPublish: { type: Boolean, default: false },
      requireApproval: { type: Boolean, default: true },
      minContentLength: { type: Number, default: 100 },
    },
    security: {
      enableTwoFactor: { type: Boolean, default: false },
      sessionTimeout: { type: Number, default: 1800 },
      maxLoginAttempts: { type: Number, default: 5 },
      enforceSSL: { type: Boolean, default: true },
    },
    seo: {
      siteName: { type: String, default: '' },
      keywords: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      googleAnalyticsId: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Settings', SettingsSchema);
