import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL as string;

const redis = new Redis(redisUrl);

export const storeRefreshToken = async (userId: string, refToken: string) => {
  await redis.set(`refresh_token:${userId}`, refToken, "EX", 7 * 24 * 60 * 60); // 7d
};
