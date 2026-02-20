import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    slug: { type: String, required: true, unique: true },
    icon: String,
    description: String,
    color: { type: String, default: '#ef4444' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

export default mongoose.model('Category', CategorySchema);
