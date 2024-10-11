import hash from 'object-hash'
import { REDIS_URL } from '../config/lib/dotenv'
import { createClient } from 'redis'
import { Request, Response, NextFunction } from 'express';

let redisClient;

export const initRedisClient = async () => {
    redisClient = createClient({ url: REDIS_URL }).on("error", (e) => {
        console.error(`Failed to create the Redis client with error:`, e)
    });
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully')
    } catch (e) {
        console.error('Failed to connect to Redis with error:', e)
    }
}

const requestToKey = (req: Request) => {
    const toHash = {
        param: req.params,
        body: req.body,
    }
    return `${req.path}@${hash.sha1(toHash)}`;
}

const isRedisReady = () => {
    return redisClient.isOpen
}

const write = async (key: unknown, value: string, options: unknown) => {     
    if (isRedisReady()) {
        try {
            await redisClient.set(key, value, options);
        } catch(e) {
            console.error(`Failed to cache data for key=${key}`, e)
        }
    }
}

const read = async (key: string) => {  
    if (isRedisReady()) {
        return await redisClient.get(key)
    }  
}

export const redisCachingMiddleware = (options = { EX: 10800 }) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (isRedisReady()) {
        const key = requestToKey(req)
        const cachedValue = await read(key)
        if (cachedValue) {
          return res.json(JSON.parse(cachedValue))
        } else {
          const oldSend = res.send
          res.send = function (data) {
            res.send = oldSend
            if (res.statusCode.toString().startsWith("2")) {
              write(key, data, options).then()
            }
            return res.send(data)
          };
          next()
        }
      } else {
        next()
      }
    }
}
  