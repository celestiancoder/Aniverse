import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      console.error(`Unknown error: ${error}`);
      throw new Error('Database connection failed due to an unknown error');
    }
  }
};

export default connectDB;