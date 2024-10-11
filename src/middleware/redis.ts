import hash from 'object-hash'
import { REDIS_URL } from '../config/lib/dotenv'
import { createClient } from 'redis'

let redisClient;

export const initRedisClient = async () => {
    try {
        redisClient = createClient({ url: REDIS_URL }).on("error", (e) => {
            console.error(`Failed to create the Redis client with error:`, e)
        });
        await redisClient.connect();
    } catch (e) {
        console.error('Failed to connect to Redis with error:', e)
    }
}
