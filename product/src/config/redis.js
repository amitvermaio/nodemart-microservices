import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => console.log('Product Service: Connected to Redis'));
redis.on('error', (err) => console.error('Product Service: Redis error:', err));

export const CACHE_TTL = 1800;            // 30 minutes
export const PRODUCT_LIST_PREFIX = 'products:list:';
export const PRODUCT_DETAIL_PREFIX = 'products:detail:';

export default redis;
