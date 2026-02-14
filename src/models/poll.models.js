import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  pollId: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  votes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      optionIndex: Number,
    },
  ],
});

export default mongoose.model('Poll', PollSchema);
