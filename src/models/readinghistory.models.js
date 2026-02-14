import mongoose from 'mongoose';

const ReadingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

export default mongoose.model('ReadingHistory', ReadingHistorySchema);
