import mongoose from 'mongoose';
import config from '../config';

const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongodb_uri) {
      throw new Error('Database URL is not defined');
    }
    
    await mongoose.connect(config.mongodb_uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;