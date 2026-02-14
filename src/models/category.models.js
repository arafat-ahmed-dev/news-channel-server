import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
});

export default mongoose.model('Category', CategorySchema);
