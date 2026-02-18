import Media from '../models/media.models.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

// Get all media
const getAllMedia = asyncHandler(async (req, res) => {
  const media = await Media.find();
  return res
    .status(200)
    .json(new ApiResponse(200, media, 'Media fetched successfully'));
});

// Get media by ID
const getMediaById = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const media = await Media.findById(mediaId);

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

export { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia };
