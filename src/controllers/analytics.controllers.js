import Analytics from '../models/analytics.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all analytics
const getAllAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Analytics.find().sort({ date: -1 }).lean();
  return res
    .status(200)
    .json(new ApiResponse(200, analytics, 'Analytics fetched successfully'));
});

// Get analytics by date range
const getAnalyticsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, 'Start date and end date are required');
  }

  const analytics = await Analytics.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .sort({ date: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, 'Analytics fetched successfully'));
});

// Get latest analytics
const getLatestAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne().sort({ date: -1 }).lean();

  if (!analytics) {
    throw new ApiError(404, 'No analytics data found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, analytics, 'Latest analytics fetched successfully'),
    );
});

// Get analytics with range parameter (returns nested structure)
const getAnalyticsByRange = asyncHandler(async (req, res) => {
  const { range } = req.query;

  let startDate = new Date();

  // Calculate date range
  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
  }

  const analytics = await Analytics.find({
    date: { $gte: startDate },
  })
    .sort({ date: -1 })
    .lean();

  if (!analytics || analytics.length === 0) {
    // Return default structure if no data
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          overview: {
            pageViews: 0,
            uniqueUsers: 0,
            sessions: 0,
            bounceRate: 0,
            avgSessionDuration: 0,
          },
          audience: {
            topCountries: [],
            topDevices: [],
          },
          content: {
            topArticles: [],
            topCategories: [],
          },
          realtime: {
            liveVisitors: 0,
            currentPageViews: 0,
            activeUsers: 0,
          },
        },
        'Analytics fetched successfully',
      ),
    );
  }

  // Aggregate data from multiple records
  const aggregated = analytics.reduce(
    (acc, doc) => {
      acc.pageViews += doc.pageViews || 0;
      acc.uniqueUsers += doc.uniqueUsers || 0;
      acc.sessions += doc.sessions || 0;
      acc.bounceRate = doc.bounceRate || acc.bounceRate;
      acc.avgSessionDuration = doc.avgSessionDuration || acc.avgSessionDuration;

      // Merge arrays (use latest)
      if (doc.topCountries?.length) acc.topCountries = doc.topCountries;
      if (doc.topDevices?.length) acc.topDevices = doc.topDevices;
      if (doc.topArticles?.length) acc.topArticles = doc.topArticles;
      if (doc.topCategories?.length) acc.topCategories = doc.topCategories;

      return acc;
    },
    {
      pageViews: 0,
      uniqueUsers: 0,
      sessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      topCountries: [],
      topDevices: [],
      topArticles: [],
      topCategories: [],
    },
  );

  const result = {
    overview: {
      pageViews: aggregated.pageViews,
      uniqueUsers: aggregated.uniqueUsers,
      sessions: aggregated.sessions,
      bounceRate: aggregated.bounceRate,
      avgSessionDuration: aggregated.avgSessionDuration,
    },
    audience: {
      topCountries: aggregated.topCountries.map((c) => ({
        country: c.country,
        users: c.users,
        percentage: c.percentage || 0,
      })),
      topDevices: aggregated.topDevices.map((d) => ({
        device: d.device,
        users: d.users,
        percentage: d.percentage || 0,
      })),
    },
    content: {
      topArticles: aggregated.topArticles.map((a) => ({
        title: a.title,
        views: a.views,
        avgTime: a.avgTime || 0,
      })),
      topCategories: aggregated.topCategories.map((c) => ({
        category: c.category,
        views: c.views,
      })),
    },
    realtime: {
      liveVisitors: Math.floor(aggregated.uniqueUsers * 0.1), // 10% of unique users
      currentPageViews:
        aggregated.pageViews > 0
          ? Math.floor(aggregated.pageViews / (analytics.length || 1))
          : 0,
      activeUsers: aggregated.uniqueUsers,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Analytics fetched successfully'));
});

// Create analytics
const createAnalytics = asyncHandler(async (req, res) => {
  const {
    pageViews,
    uniqueUsers,
    sessions,
    bounceRate,
    avgSessionDuration,
    topCountries,
    topDevices,
    topArticles,
    topCategories,
  } = req.body;

  const analytics = new Analytics({
    pageViews,
    uniqueUsers,
    sessions,
    bounceRate,
    avgSessionDuration,
    topCountries,
    topDevices,
    topArticles,
    topCategories,
  });

  await analytics.save();

  return res
    .status(201)
    .json(new ApiResponse(201, analytics, 'Analytics created successfully'));
});

// Update analytics
const updateAnalytics = asyncHandler(async (req, res) => {
  const { analyticsId } = req.params;
  const {
    pageViews,
    uniqueUsers,
    sessions,
    bounceRate,
    avgSessionDuration,
    topCountries,
    topDevices,
    topArticles,
    topCategories,
  } = req.body;

  const analytics = await Analytics.findById(analyticsId);
  if (!analytics) {
    throw new ApiError(404, 'Analytics not found');
  }

  if (pageViews !== undefined) analytics.pageViews = pageViews;
  if (uniqueUsers !== undefined) analytics.uniqueUsers = uniqueUsers;
  if (sessions !== undefined) analytics.sessions = sessions;
  if (bounceRate !== undefined) analytics.bounceRate = bounceRate;
  if (avgSessionDuration !== undefined)
    analytics.avgSessionDuration = avgSessionDuration;
  if (topCountries) analytics.topCountries = topCountries;
  if (topDevices) analytics.topDevices = topDevices;
  if (topArticles) analytics.topArticles = topArticles;
  if (topCategories) analytics.topCategories = topCategories;

  await analytics.save();

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, 'Analytics updated successfully'));
});

// Delete analytics
const deleteAnalytics = asyncHandler(async (req, res) => {
  const { analyticsId } = req.params;

  const analytics = await Analytics.findByIdAndDelete(analyticsId);

  if (!analytics) {
    throw new ApiError(404, 'Analytics not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, 'Analytics deleted successfully'));
});

export {
  getAllAnalytics,
  getAnalyticsByDateRange,
  getLatestAnalytics,
  getAnalyticsByRange,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
};
