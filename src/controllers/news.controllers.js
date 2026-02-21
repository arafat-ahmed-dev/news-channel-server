import NewsArticle from '../models/news.models.js';
import Category from '../models/category.models.js';
import Media from '../models/media.models.js';
import cloudinary from '../utils/cloudinary.js';
import DOMPurify from 'isomorphic-dompurify';
import fs from 'fs';

/**
 * Sanitize HTML content to prevent XSS
 */
function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'code',
      'span',
      'div',
      'hr',
      'sub',
      'sup',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'target',
      'rel',
      'width',
      'height',
      'style',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

// Resolve category: accepts either an ObjectId or a slug string
async function resolveCategory(categoryInput) {
  if (!categoryInput) return { categoryId: null, categorySlug: null };
  // If it's already a valid ObjectId, keep it
  if (categoryInput.match?.(/^[0-9a-fA-F]{24}$/)) {
    const cat = await Category.findById(categoryInput).lean();
    return cat
      ? { categoryId: cat._id, categorySlug: cat.slug }
      : { categoryId: null, categorySlug: null };
  }
  // Otherwise treat as slug
  const cat = await Category.findOne({ slug: categoryInput }).lean();
  return cat
    ? { categoryId: cat._id, categorySlug: cat.slug }
    : { categoryId: null, categorySlug: categoryInput };
}

// Helper: save an entry to the Media library after a Cloudinary upload
async function saveToMediaLibrary(file, url) {
  try {
    await Media.create({
      name: file.originalname || file.filename,
      type: 'image',
      size: file.size || 0,
      url,
      usage: 0,
    });
  } catch {
    // Non-fatal — don't block the main operation
  }
}

async function attachCategoriesBySlug(newsItems) {
  if (!newsItems?.length) return newsItems;

  const categorySlugs = [
    ...new Set(newsItems.map((item) => item.categorySlug).filter(Boolean)),
  ];

  if (!categorySlugs.length) return newsItems;

  const categories = await Category.find({ slug: { $in: categorySlugs } })
    .select('name nameEn slug icon color')
    .lean();

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );

  return newsItems.map((item) => ({
    ...item,
    category: categoryBySlug.get(item.categorySlug) || null,
  }));
}

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
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      });
      imageUrl = result.secure_url;
      uploadedToCloud = true;
      saveToMediaLibrary(req.file, imageUrl); // fire-and-forget
    }

    const news = new NewsArticle({
      ...req.body,
      image: imageUrl,
      content: sanitizeHtml(req.body.content),
      excerpt: sanitizeHtml(req.body.excerpt),
    });

    // Resolve category slug → ObjectId
    if (req.body.category || req.body.categorySlug) {
      const { categoryId, categorySlug } = await resolveCategory(
        req.body.category || req.body.categorySlug,
      );
      if (categoryId) news.category = categoryId;
      if (categorySlug) news.categorySlug = categorySlug;
    }

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
    const {
      category,
      featured,
      trending,
      status = 'published',
      limit = 50,
      page = 1,
      search,
      exclude,
    } = req.query;

    const filter = {};

    // Only filter by status if explicitly provided or default to published
    if (status) filter.status = status;
    if (category) filter.categorySlug = category;
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    if (search) {
      // Sanitize search input to prevent ReDoS attacks
      const sanitized = String(search)
        .slice(0, 100)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: new RegExp(sanitized, 'i') },
        { excerpt: new RegExp(sanitized, 'i') },
      ];
    }
    if (exclude) filter.slug = { $ne: exclude };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const news = await NewsArticle.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean();

    const newsWithCategory = await attachCategoriesBySlug(news);

    const total = await NewsArticle.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: newsWithCategory,
      pagination: {
        total,
        page: parseInt(page),
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get news by slug
export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const news = await NewsArticle.findOne({ slug }).lean();
    if (!news)
      return res.status(404).json({ success: false, message: 'Not found' });

    const [newsWithCategory] = await attachCategoriesBySlug([news]);

    res.set('Cache-Control', 'no-store');
    res.status(200).json({ success: true, data: newsWithCategory });
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

    // Sanitize HTML content fields
    if (updateData.content)
      updateData.content = sanitizeHtml(updateData.content);
    if (updateData.excerpt)
      updateData.excerpt = sanitizeHtml(updateData.excerpt);

    // If a new image file was uploaded, upload to Cloudinary
    if (req.file) {
      uploadedFilePath = req.file.path;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news-images',
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      });
      updateData.image = result.secure_url;
      uploadedToCloud = true;
      saveToMediaLibrary(req.file, result.secure_url); // fire-and-forget
    }

    // If category is being updated, resolve slug → ObjectId
    if (updateData.category || updateData.categorySlug) {
      const { categoryId, categorySlug } = await resolveCategory(
        updateData.category || updateData.categorySlug,
      );
      if (categoryId) updateData.category = categoryId;
      if (categorySlug) updateData.categorySlug = categorySlug;
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
