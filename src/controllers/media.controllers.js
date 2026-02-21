import Media from '../models/media.models.js';
import NewsArticle from '../models/news.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Upload a file to Cloudinary and save to Media library
const uploadMediaFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file provided');
  }

  let cloudResult;
  try {
    cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'media-library',
      resource_type: 'auto',
    });
  } finally {
    // Remove temp file regardless
    fs.promises.unlink(req.file.path).catch(() => {});
  }

  const type =
    cloudResult.resource_type === 'video'
      ? 'video'
      : cloudResult.resource_type === 'raw'
        ? 'audio'
        : 'image';

  const media = await Media.create({
    name: req.file.originalname || req.file.filename,
    type,
    size: req.file.size || cloudResult.bytes || 0,
    url: cloudResult.secure_url,
    usage: 0,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, media, 'Media uploaded successfully'));
});

// Get all media — merges Media library + all news article images
const getAllMedia = asyncHandler(async (req, res) => {
  // 1. Get saved Media records
  const savedMedia = await Media.find().lean();
  const savedUrls = new Set(savedMedia.map((m) => m.url));

  // 2. Get all news articles that have an image
  const articles = await NewsArticle.find(
    { image: { $exists: true, $ne: '' } },
    'title slug image createdAt',
  ).lean();

  // 3. Build virtual media entries for news images not already in the library
  const newsMediaEntries = articles
    .filter((a) => a.image && !savedUrls.has(a.image))
    .map((a) => ({
      _id: `news-${a._id}`, // virtual ID — not a real Media doc
      name: a.title || a.slug || 'news-image',
      type: 'image',
      size: 0,
      url: a.image,
      usage: 1, // used in this article
      createdAt: a.createdAt,
      source: 'news', // hint for frontend
    }));

  // 4. Merge: saved Media first (newest first), then news images
  const all = [...savedMedia, ...newsMediaEntries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, all, 'Media fetched successfully'));
});

// Get media by ID
const getMediaById = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const media = await Media.findById(mediaId).lean();

  if (!media) {
    throw new ApiError(404, 'Media not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, media, 'Media fetched successfully'));
});

// Create media
const createMedia = asyncHandler(async (req, res) => {
  const { name, type, size, url, usage } = req.body;

  if (!name || !type || !size || !url) {
    throw new ApiError(400, 'Name, type, size, and URL are required');
  }

  const media = new Media({
    name,
    type,
    size,
    url,
    usage: usage || 0,
  });

  await media.save();

  return res
    .status(201)
    .json(new ApiResponse(201, media, 'Media created successfully'));
});

// Update media
const updateMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const { name, type, size, url, usage } = req.body;

  const media = await Media.findById(mediaId);
  if (!media) {
    throw new ApiError(404, 'Media not found');
  }

  if (name) media.name = name;
  if (type) media.type = type;
  if (size) media.size = size;
  if (url) media.url = url;
  if (usage !== undefined) media.usage = usage;

  await media.save();

  return res
    .status(200)
    .json(new ApiResponse(200, media, 'Media updated successfully'));
});

// Delete media
const deleteMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  const media = await Media.findByIdAndDelete(mediaId);

  if (!media) {
    throw new ApiError(404, 'Media not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, media, 'Media deleted successfully'));
});

export {
  getAllMedia,
  getMediaById,
  uploadMediaFile,
  createMedia,
  updateMedia,
  deleteMedia,
};
