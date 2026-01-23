import { Redis } from 'ioredis';

let redis;

if (process.env.NODE_ENV === 'test') {
  const store = new Map();

  redis = {
    async set(key, value) {
      store.set(key, value);
      return 'OK';
    },
    async get(key) {
      return store.get(key);
    },
    async del(key) {
      const existed = store.delete(key);
      return existed ? 1 : 0;
    },
    on() {
      // no-op in test environment
    },
    disconnect() {
      // no-op in test environment
    },
    quit() {
      // no-op in test environment
    }
  };
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
}

export default redis;