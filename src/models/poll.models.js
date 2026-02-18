import mongoose from 'mongoose';

const PollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PollSchema = new mongoose.Schema(
  {
    pollId: { type: String, unique: true, sparse: true },
    question: { type: String, required: true },
    options: [PollOptionSchema],
    status: {
      type: String,
      enum: ['active', 'closed', 'scheduled'],
      default: 'active',
    },
    votes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        optionIndex: Number,
      },
    ],
  },
  { timestamps: true },
);

// Auto-generate pollId before saving if not provided
PollSchema.pre('save', function (next) {
  if (!this.pollId) {
    this.pollId = Date.now().toString();
  }
  next();
});

export default mongoose.model('Poll', PollSchema);
