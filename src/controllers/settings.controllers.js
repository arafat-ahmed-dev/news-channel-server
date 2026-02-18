import Settings from '../models/settings.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all settings
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    // Create default settings if they don't exist
    settings = new Settings();
    await settings.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, settings, 'Settings fetched successfully'));
});

// Update settings
const updateSettings = asyncHandler(async (req, res) => {
  const { siteInfo, notifications, publishing, security, seo } = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = new Settings();
  }

  if (siteInfo) {
    settings.siteInfo = {
      ...settings.siteInfo,
      ...siteInfo,
    };
  }

  if (notifications) {
    settings.notifications = {
      ...settings.notifications,
      ...notifications,
    };
  }

  if (publishing) {
    settings.publishing = {
      ...settings.publishing,
      ...publishing,
    };
  }

  if (security) {
    settings.security = {
      ...settings.security,
      ...security,
    };
  }

  if (seo) {
    settings.seo = {
      ...settings.seo,
      ...seo,
    };
  }

  await settings.save();

  return res
    .status(200)
    .json(new ApiResponse(200, settings, 'Settings updated successfully'));
});

// Reset settings to default
const resetSettings = asyncHandler(async (req, res) => {
  await Settings.deleteMany({});

  const settings = new Settings();
  await settings.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, settings, 'Settings reset to default successfully'),
    );
});

export { getSettings, updateSettings, resetSettings };
