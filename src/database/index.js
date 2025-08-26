import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI is not defined');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI + process.env.DATABASE_NAME);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error(' ❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
