import mongoose from 'mongoose';
import Analytics from '../src/models/analytics.models.js';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/news-channel';

const seedAnalyticsData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Analytics.deleteMany({});
    console.log('Cleared existing analytics data');

    // Create sample data for different dates
    const now = new Date();
    const analyticsRecords = [];

    // Generate 30 days of sample data
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const pageViews = Math.floor(Math.random() * 5000) + 1000;
      const uniqueUsers = Math.floor(pageViews * 0.3);

      analyticsRecords.push({
        date,
        pageViews,
        uniqueUsers,
        sessions: Math.floor(uniqueUsers * 1.2),
        bounceRate: Math.floor(Math.random() * 40) + 20,
        avgSessionDuration: Math.floor(Math.random() * 600) + 60,
        topCountries: [
          {
            country: 'Bangladesh',
            users: Math.floor(uniqueUsers * 0.5),
            percentage: 50,
          },
          {
            country: 'USA',
            users: Math.floor(uniqueUsers * 0.25),
            percentage: 25,
          },
          {
            country: 'India',
            users: Math.floor(uniqueUsers * 0.15),
            percentage: 15,
          },
          {
            country: 'UK',
            users: Math.floor(uniqueUsers * 0.1),
            percentage: 10,
          },
        ],
        topDevices: [
          {
            device: 'Mobile',
            users: Math.floor(uniqueUsers * 0.65),
            percentage: 65,
          },
          {
            device: 'Desktop',
            users: Math.floor(uniqueUsers * 0.25),
            percentage: 25,
          },
          {
            device: 'Tablet',
            users: Math.floor(uniqueUsers * 0.1),
            percentage: 10,
          },
        ],
        topArticles: [
          {
            title: 'Breaking News: New Government Policy',
            views: Math.floor(pageViews * 0.2),
            avgTime: 280,
          },
          {
            title: 'Sports Update: Cricket World Cup',
            views: Math.floor(pageViews * 0.15),
            avgTime: 240,
          },
          {
            title: 'Business: Stock Market Analysis',
            views: Math.floor(pageViews * 0.12),
            avgTime: 320,
          },
          {
            title: 'Weather Alert: Heavy Rain Expected',
            views: Math.floor(pageViews * 0.1),
            avgTime: 120,
          },
          {
            title: 'Entertainment: Celebrity Interview',
            views: Math.floor(pageViews * 0.08),
            avgTime: 400,
          },
        ],
        topCategories: [
          {
            category: 'Politics',
            views: Math.floor(pageViews * 0.25),
          },
          {
            category: 'Sports',
            views: Math.floor(pageViews * 0.2),
          },
          {
            category: 'Business',
            views: Math.floor(pageViews * 0.15),
          },
          {
            category: 'Technology',
            views: Math.floor(pageViews * 0.15),
          },
          {
            category: 'Entertainment',
            views: Math.floor(pageViews * 0.1),
          },
          {
            category: 'Weather',
            views: Math.floor(pageViews * 0.08),
          },
          {
            category: 'Health',
            views: Math.floor(pageViews * 0.07),
          },
        ],
      });
    }

    // Insert all records
    await Analytics.insertMany(analyticsRecords);
    console.log(
      `✅ Successfully seeded ${analyticsRecords.length} analytics records`,
    );

    // Display summary
    const latestAnalytics = await Analytics.findOne().sort({ date: -1 });
    console.log('\nLatest Analytics Record:');
    console.log(`- Date: ${latestAnalytics.date}`);
    console.log(`- Page Views: ${latestAnalytics.pageViews}`);
    console.log(`- Unique Users: ${latestAnalytics.uniqueUsers}`);
    console.log(`- Sessions: ${latestAnalytics.sessions}`);
    console.log(`- Bounce Rate: ${latestAnalytics.bounceRate}%`);
    console.log(
      `- Avg Session Duration: ${latestAnalytics.avgSessionDuration}s`,
    );

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
    process.exit(1);
  }
};

// Run seed script
seedAnalyticsData();
