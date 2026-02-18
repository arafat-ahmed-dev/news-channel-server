import mongoose from 'mongoose';

const NewsArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleEn: String,
    excerpt: { type: String, required: true },
    content: String,
    image: String,
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model('NewsArticle', NewsArticleSchema);
