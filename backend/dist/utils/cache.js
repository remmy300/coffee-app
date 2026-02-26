import redisClient, { isRedisReady } from "./redisClient.js";
export const cacheWrapper = async (key, ttl, callback) => {
    try {
        if (!isRedisReady()) {
            return callback();
        }
        const cachedData = await redisClient.get(key).catch(() => null);
        if (cachedData) {
            console.log("fetching cached data:", key);
            return JSON.parse(cachedData);
        }
        const freshData = await callback(); //if no cashed data fetch fresh data from the DB
        redisClient.setEx(key, ttl, JSON.stringify(freshData)).catch(() => { }); //save to redis
        return freshData;
    }
    catch (error) {
        console.error("error caching data:", error.message);
        return callback();
    }
};
