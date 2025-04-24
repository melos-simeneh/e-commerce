import mongoose from "mongoose";
import { timestamp } from "./utils.js";

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 5000;

export const mongoDBConnection = async (retries = 0) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log(`[${timestamp()}][Info] MongoDB connected successfully`);
  } catch (err) {
    console.error(
      `[${timestamp()}][Error]  DB connection failed (attempt ${
        retries + 1
      }/${MAX_RETRIES}):`,
      err.message
    );

    if (retries < MAX_RETRIES) {
      const delay = Math.min(
        INITIAL_RETRY_DELAY * Math.pow(2, retries) + Math.random() * 1000,
        MAX_RETRY_DELAY
      );

      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return mongoDBConnection(retries + 1);
    } else {
      console.error(
        `[${timestamp()}][Error] Max connection retries reached. Application will exit.`
      );
      process.exit(1);
    }
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log(
    `[${timestamp()}][Info] Mongoose connection closed due to application termination`
  );
  process.exit(0);
});
