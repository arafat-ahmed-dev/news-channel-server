import Ads from '../models/ads.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all ads
const getAllAds = asyncHandler(async (req, res) => {
  const ads = await Ads.find().lean();
  return res
    .status(200)
    .json(new ApiResponse(200, ads, 'Ads fetched successfully'));
});

// Get ad by ID
const getAdById = asyncHandler(async (req, res) => {
  const { adId } = req.params;
  const ad = await Ads.findById(adId).lean();

  if (!ad) {
    throw new ApiError(404, 'Ad not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ad, 'Ad fetched successfully'));
});

// Create ad
const createAd = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    placement,
    status,
    impressions,
    clicks,
    startDate,
    endDate,
  } = req.body;

  if (!title || !type || !placement || !startDate || !endDate) {
    throw new ApiError(
      400,
      'Title, type, placement, start date, and end date are required',
    );
  }

  const ad = new Ads({
    title,
    type,
    placement,
    status: status || 'active',
    impressions: impressions || 0,
    clicks: clicks || 0,
    startDate,
    endDate,
  });

  await ad.save();

  return res
    .status(201)
    .json(new ApiResponse(201, ad, 'Ad created successfully'));
});

// Update ad
const updateAd = asyncHandler(async (req, res) => {
  const { adId } = req.params;
  const {
    title,
    type,
    placement,
    status,
    impressions,
    clicks,
    startDate,
    endDate,
  } = req.body;

  const ad = await Ads.findById(adId);
  if (!ad) {
    throw new ApiError(404, 'Ad not found');
  }

  if (title) ad.title = title;
  if (type) ad.type = type;
  if (placement) ad.placement = placement;
  if (status) ad.status = status;
  if (impressions !== undefined) ad.impressions = impressions;
  if (clicks !== undefined) ad.clicks = clicks;
  if (startDate) ad.startDate = startDate;
  if (endDate) ad.endDate = endDate;

  await ad.save();

  return res
    .status(200)
    .json(new ApiResponse(200, ad, 'Ad updated successfully'));
});

// Delete ad
const deleteAd = asyncHandler(async (req, res) => {
  const { adId } = req.params;

  const ad = await Ads.findByIdAndDelete(adId);

  if (!ad) {
    throw new ApiError(404, 'Ad not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ad, 'Ad deleted successfully'));
});

export { getAllAds, getAdById, createAd, updateAd, deleteAd };
