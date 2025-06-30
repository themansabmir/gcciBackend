import mongoose from 'mongoose';
import { MONGO_URI, ENV } from './env';
import { log } from 'console';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected (${ENV})`);
  } catch (err) {
    console.error(`❌ MongoDB connection error (${ENV}):`, err);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log(`🔌 MongoDB disconnected (${ENV})`);
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err);
  }
};
