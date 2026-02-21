import Comment from '../models/comment.models.js';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Strip all HTML and limit length for comment content
 */
function sanitizeComment(text) {
  if (!text) return '';
  // Strip ALL HTML from comments (plain text only)
  const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  return clean.slice(0, 2000); // max 2000 chars
}

export const getAllComments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const skip = (parseInt(page) - 1) * safeLimit;
    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate('articleId', 'title slug')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Comment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: comments,
      pagination: { total, page: parseInt(page), limit: safeLimit },
    });
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const commentData = {
      ...req.body,
      content: sanitizeComment(req.body.content),
      author: DOMPurify.sanitize(req.body.author || '', {
        ALLOWED_TAGS: [],
      }).slice(0, 100),
    };
    const comment = new Comment(commentData);
    await comment.save();
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

export const getCommentsByArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId })
      .populate('replies')
      .lean();
    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

export const updateCommentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({
      success: true,
      data: comment,
      message: 'Comment status updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
