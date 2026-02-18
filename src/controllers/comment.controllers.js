import Comment from '../models/comment.models.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

export const getCommentsByArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId }).populate('replies');
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

    res
      .status(200)
      .json({
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
