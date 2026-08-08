import mongoose from "mongoose";

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI is not set. Using temporary in-memory API data.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected.");
  } catch (error) {
    console.log(`MongoDB unavailable: ${error.message}`);
    console.log("Using temporary in-memory API data instead.");
  }
};

export default connectDatabase;
