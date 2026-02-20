import 'dotenv/config';
import mongoose from 'mongoose';

// ─── DB connection ────────────────────────────────────────────────────────────
const MONGO_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost:27017/') +
  (process.env.DATABASE_NAME || 'news_channel_db');

// ─── Inline models (avoid circular imports) ───────────────────────────────────
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
    votes: [{ userId: mongoose.Schema.Types.ObjectId, optionIndex: Number }],
  },
  { timestamps: true },
);
PollSchema.pre('save', function (next) {
  if (!this.pollId) this.pollId = Date.now().toString();
  next();
});
const Poll = mongoose.models.Poll || mongoose.model('Poll', PollSchema);

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsArticle',
    required: true,
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  isLiked: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'approved', 'spam'],
    default: 'pending',
  },
});
const Comment =
  mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

const NewsArticleSchema = new mongoose.Schema({}, { strict: false });
const NewsArticle =
  mongoose.models.NewsArticle ||
  mongoose.model('NewsArticle', NewsArticleSchema);

// ─── Poll seed data ───────────────────────────────────────────────────────────
const polls = [
  {
    question: 'বাংলাদেশের সেরা ক্রিকেটার কে?',
    options: [
      { text: 'সাকিব আল হাসান', votes: 1245 },
      { text: 'তামিম ইকবাল', votes: 876 },
      { text: 'মুশফিকুর রহিম', votes: 654 },
      { text: 'মাহমুদুল্লাহ', votes: 321 },
    ],
    status: 'active',
  },
  {
    question:
      'আগামী নির্বাচনে আপনি কোন বিষয়টিকে সবচেয়ে গুরুত্বপূর্ণ মনে করেন?',
    options: [
      { text: 'অর্থনীতি ও কর্মসংস্থান', votes: 2134 },
      { text: 'শিক্ষা ব্যবস্থার উন্নতি', votes: 1567 },
      { text: 'দুর্নীতি দমন', votes: 1890 },
      { text: 'স্বাস্থ্যসেবার মান উন্নয়ন', votes: 987 },
    ],
    status: 'active',
  },
  {
    question: 'বাংলাদেশের সবচেয়ে বড় সমস্যা কোনটি?',
    options: [
      { text: 'যানজট', votes: 789 },
      { text: 'দুর্নীতি', votes: 1234 },
      { text: 'বেকারত্ব', votes: 1056 },
      { text: 'পরিবেশ দূষণ', votes: 543 },
    ],
    status: 'active',
  },
  {
    question: 'আপনি কি ডিজিটাল পেমেন্ট ব্যবহার করেন?',
    options: [
      { text: 'হ্যাঁ, নিয়মিত', votes: 3421 },
      { text: 'মাঝে মাঝে', votes: 1234 },
      { text: 'না, এখনো নগদে লেনদেন করি', votes: 567 },
    ],
    status: 'closed',
  },
  {
    question: 'বাংলাদেশের টেক স্টার্টআপ সেক্টর সম্পর্কে আপনার মতামত?',
    options: [
      { text: 'অনেক সম্ভাবনা আছে', votes: 1876 },
      { text: 'আরো সরকারি সহায়তা দরকার', votes: 2341 },
      { text: 'যথেষ্ট উন্নতি হচ্ছে', votes: 654 },
      { text: 'এখনো অনেক পিছিয়ে', votes: 432 },
    ],
    status: 'active',
  },
];

// ─── Comment seed data (content only – articleId added dynamically) ───────────
const commentTemplates = [
  {
    author: 'আহমেদ রানা',
    content: 'অনেক গুরুত্বপূর্ণ তথ্য। ধন্যবাদ শেয়ার করার জন্য।',
    status: 'approved',
    likes: 12,
  },
  {
    author: 'সাদিয়া ইসলাম',
    content: 'এই বিষয়টি নিয়ে আরো বিস্তারিত লেখা উচিত ছিল।',
    status: 'approved',
    likes: 8,
  },
  {
    author: 'করিম হোসেন',
    content: 'সত্যিই চিন্তার বিষয়। সরকারের এখনই পদক্ষেপ নেওয়া উচিত।',
    status: 'pending',
    likes: 5,
  },
  {
    author: 'রেহানা বেগম',
    content: 'আমি এই বিষয়ে একমত নই। আরো তথ্য প্রয়োজন।',
    status: 'approved',
    likes: 3,
  },
  {
    author: 'মোহাম্মদ আরিফ',
    content: 'চমৎকার বিশ্লেষণ! অনেক কিছু জানতে পারলাম।',
    status: 'approved',
    likes: 20,
  },
  {
    author: 'নাসরিন আক্তার',
    content: 'দেশের উন্নয়নে এটি অত্যন্ত প্রয়োজনীয় পদক্ষেপ।',
    status: 'pending',
    likes: 6,
  },
  {
    author: 'ফারুক আহমেদ',
    content: 'এই রিপোর্টটি একপাক্ষিক মনে হচ্ছে। আরো দৃষ্টিভঙ্গি থাকা দরকার।',
    status: 'spam',
    likes: 1,
  },
  {
    author: 'শামীমা নাসরিন',
    content: 'অসাধারণ! এই তথ্যগুলো সকলের জানা উচিত।',
    status: 'approved',
    likes: 15,
  },
  {
    author: 'তানভীর হাসান',
    content: 'প্রতিবেদকের সাথে আমি সম্পূর্ণ একমত।',
    status: 'approved',
    likes: 9,
  },
  {
    author: 'মারিয়াম খান',
    content: 'আশা করি কর্তৃপক্ষ এই বিষয়টিতে মনোযোগ দেবেন।',
    status: 'pending',
    likes: 4,
  },
];

// ─── Main seeder ─────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // ── Polls ──────────────────────────────────────────────────────────────────
  let pollsCreated = 0;
  for (const pollData of polls) {
    const existing = await Poll.findOne({ question: pollData.question });
    if (!existing) {
      await Poll.create(pollData);
      pollsCreated++;
    }
  }
  console.log(
    `✅ Polls: ${pollsCreated} created (${polls.length - pollsCreated} already existed)`,
  );

  // ── Comments ───────────────────────────────────────────────────────────────
  const articles = await NewsArticle.find({}, '_id title').limit(10).lean();
  if (articles.length === 0) {
    console.log(
      '⚠️  No articles found in DB – skipping comment seeding. Run seedNews.js first.',
    );
    await mongoose.disconnect();
    return;
  }

  let commentsCreated = 0;
  for (let i = 0; i < commentTemplates.length; i++) {
    const article = articles[i % articles.length];
    const template = commentTemplates[i];
    const exists = await Comment.findOne({
      author: template.author,
      articleId: article._id,
    });
    if (!exists) {
      await Comment.create({
        articleId: article._id,
        author: template.author,
        content: template.content,
        timestamp:
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        likes: template.likes,
        status: template.status,
      });
      commentsCreated++;
    }
  }
  console.log(
    `✅ Comments: ${commentsCreated} created (${commentTemplates.length - commentsCreated} already existed)`,
  );

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
