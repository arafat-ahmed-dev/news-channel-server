import mongoose from 'mongoose';

const NewsArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleEn: String,
    excerpt: { type: String, required: true },
    content: String,
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    categorySlug: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    slug: { type: String, required: true, unique: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    scheduledFor: { type: Date, default: null },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      canonicalUrl: String,
    },
    featuredImage: {
      url: String,
      alt: String,
      publicId: String,
    },
  },
  { timestamps: true },
);

// Required indexes for performance
// slug index already created by unique:true on field
NewsArticleSchema.index({ date: -1 });
NewsArticleSchema.index({ category: 1, date: -1 });
NewsArticleSchema.index({ status: 1, date: -1 });
NewsArticleSchema.index({ featured: 1, date: -1 });
NewsArticleSchema.index({ trending: 1, date: -1 });
NewsArticleSchema.index({ tags: 1 });
NewsArticleSchema.index({ categorySlug: 1, date: -1 });

export default mongoose.model('NewsArticle', NewsArticleSchema);
