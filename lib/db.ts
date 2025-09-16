import mongoose from "mongoose";

let isConnected = 0;

export async function connectToDatabase() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SmartCity";
  await mongoose.connect(uri, { dbName: "SmartCity" });
  isConnected = 1;
}


