import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(env.mongoUri);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
}
