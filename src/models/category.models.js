import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: String,
    description: String,
    color: { type: String, default: '#ef4444' },
  },
  { timestamps: true },
);

export default mongoose.model('Category', CategorySchema);
