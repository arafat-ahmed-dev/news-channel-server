import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsArticle',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'surprise', 'sad', 'angry'],
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Reaction', ReactionSchema);
