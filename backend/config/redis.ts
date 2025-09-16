import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL as string;

const redis = new Redis(redisUrl);

if (!redis) {
  throw new Error("Unable to connect to redis");
}
console.log(`[+] Redis connected successfully`);

export default redis;
