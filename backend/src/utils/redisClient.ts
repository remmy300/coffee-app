import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error(err.message));

await redisClient.connect();
console.log("redis connected");

export default redisClient;
