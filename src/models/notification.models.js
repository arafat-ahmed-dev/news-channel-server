import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Number, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ timestamp: -1 });

export default mongoose.model('Notification', NotificationSchema);
