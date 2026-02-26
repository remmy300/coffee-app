import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

let redisReady = false;

redisClient.on("error", (err) => {
  redisReady = false;
  console.error("Redis error:", err.message);
});

redisClient.on("end", () => {
  redisReady = false;
});

export const initRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn("REDIS_URL not set. Redis caching is disabled.");
    return;
  }

  if (redisClient.isOpen) {
    redisReady = true;
    return;
  }

  try {
    await redisClient.connect();
    redisReady = true;
    console.log("Redis connected");
  } catch (err: any) {
    redisReady = false;
    console.error("Redis connection failed. Caching disabled:", err.message);
  }
};

export const isRedisReady = () => redisReady && redisClient.isOpen;

export default redisClient;
