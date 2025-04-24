import Redis from "ioredis";
import dotenv from "dotenv";
import { timestamp } from "./utils.js";
dotenv.config();

export const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () =>
  console.log(`[${timestamp()}][Info] Redis connected`)
);
redis.on("error", (err) =>
  console.error(
    `[${timestamp()}][ERROR] Redis connection failed: ${err.message}`
  )
);
