import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const useLocal = process.env.USE_LOCAL_DB === 'true';
  const uri = useLocal
    ? (process.env.MONGODB_LOCAL_URI ?? 'mongodb://localhost:27017/ennabook')
    : process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`[DB] Connected to ${useLocal ? 'local' : 'Atlas'} MongoDB`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
