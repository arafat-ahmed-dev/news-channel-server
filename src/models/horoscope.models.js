import mongoose from 'mongoose';

const HoroscopeSignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  symbol: String,
  dateRange: String,
});

export default mongoose.model('HoroscopeSign', HoroscopeSignSchema);
