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
  status: {
    type: String,
    enum: ['pending', 'approved', 'spam'],
    default: 'pending',
  },
});

CommentSchema.index({ articleId: 1, status: 1 });
CommentSchema.index({ status: 1 });

export default mongoose.model('Comment', CommentSchema);
