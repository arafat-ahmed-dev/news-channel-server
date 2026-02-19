import Category from '../models/category.models.js';
import NewsArticle from '../models/news.models.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();

    // Build count maps for both categorySlug and category name
    // (news may have been created with English slug OR Bengali category name)
    const countsBySlug = await NewsArticle.aggregate([
      { $group: { _id: '$categorySlug', count: { $sum: 1 } } },
    ]);
    const countsByName = await NewsArticle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const slugMap = Object.fromEntries(
      countsBySlug.filter((c) => c._id).map((c) => [c._id, c.count]),
    );
    const nameMap = Object.fromEntries(
      countsByName.filter((c) => c._id).map((c) => [c._id, c.count]),
    );

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      // Prefer slug match; fall back to name match for legacy articles
      count: slugMap[cat.slug] || nameMap[cat.name] || 0,
    }));

    res.status(200).json({ success: true, data: categoriesWithCount });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndUpdate({ slug }, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

export const deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
