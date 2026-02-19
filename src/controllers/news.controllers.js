import NewsArticle from '../models/news.models.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Create a news article
export const createNews = async (req, res, next) => {
  let uploadedFilePath;
  let uploadedToCloud = false;
  try {
    let imageUrl = req.body.image;
    // If file uploaded, upload to Cloudinary
    if (req.file) {
      uploadedFilePath = req.file.path;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news-images',
        resource_type: 'image',
      });
      imageUrl = result.secure_url;
      uploadedToCloud = true;
    }

    const news = new NewsArticle({ ...req.body, image: imageUrl });
    await news.save();
    res.status(201).json({ success: true, data: news });
  } catch (err) {
    next(err);
  } finally {
    if (uploadedToCloud && uploadedFilePath) {
      try {
        await fs.promises.unlink(uploadedFilePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Failed to remove local upload:', error);
        }
      }
    }
  }
};

// Get all news articles
export const getAllNews = async (req, res, next) => {
  try {
    const news = await NewsArticle.find();
    res.status(200).json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

// Get news by slug
export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const news = await NewsArticle.findOne({ slug });
    if (!news)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

// Update news article
export const updateNews = async (req, res, next) => {
  let uploadedFilePath;
  let uploadedToCloud = false;
  try {
    const { slug } = req.params;
    let updateData = { ...req.body };

    // If a new image file was uploaded, upload to Cloudinary
    if (req.file) {
      uploadedFilePath = req.file.path;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news-images',
        resource_type: 'image',
      });
      updateData.image = result.secure_url;
      uploadedToCloud = true;
    }

    const news = await NewsArticle.findOneAndUpdate({ slug }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!news)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ success: true, data: news });
  } catch (err) {
    next(err);
  } finally {
    if (uploadedToCloud && uploadedFilePath) {
      try {
        await fs.promises.unlink(uploadedFilePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Failed to remove local upload:', error);
        }
      }
    }
  }
};

// Delete news article
export const deleteNews = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const news = await NewsArticle.findOneAndDelete({ slug });
    if (!news)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
