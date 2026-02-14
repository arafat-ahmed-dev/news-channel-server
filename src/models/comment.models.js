import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsArticle',
    required: true,
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  isLiked: { type: Boolean, default: false },
});

export default mongoose.model('Comment', CommentSchema);
