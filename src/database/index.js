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

// Database health check function
export const checkDatabaseHealth = async () => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'unhealthy',
        message: 'Database is not connected',
        readyState: mongoose.connection.readyState,
      };
    }

    // Perform a simple ping operation to test the connection
    await mongoose.connection.db.admin().ping();

    return {
      status: 'healthy',
      message: 'Database connection is operational',
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error.message}`,
      readyState: mongoose.connection.readyState,
    };
  }
};

export default connectToDatabase;
