import * as Redis from 'ioredis';
import logger from './logger';

const redisUseTLS = process.env.REDIS_USE_TLS === 'true';
const redisTlsUrl = process.env.REDIS_TLS_URL;
const redisMainUrl = process.env.REDIS_URL;
const redisUrl = redisUseTLS && redisTlsUrl ? redisTlsUrl : redisMainUrl;

let redisStore: Redis.Redis;

const herokuTLSConfig = {
  rejectUnauthorized: false,
};

const createRedisClient = (name: string, opts?: Redis.RedisOptions) => {
  const redisClient = new Redis(redisUrl, opts);
  let errorCount = 0;

  redisClient.on('connect', () => {
    logger('info', `service/redis: client "${name}" connected to Redis server`);
  });

  redisClient.on('error', (error) => {
    errorCount += 1;

    const errorLevel = errorCount < 3 ? 'debug' : 'critical';

    logger(
      errorLevel,
      `service/redis: client "${name}" couln't establish Redis connection! Error: ${error.message}`,
    );
  });

  return redisClient;
};

export const close = () => {
  if (redisStore) {
    redisStore.disconnect();
    redisStore = null;
  }
};

export const init = () => {
  close();

  redisStore = createRedisClient('store', {
    tls: redisUseTLS ? herokuTLSConfig : null,
  });

  logger('info', 'service/redis: Redis service initialized!');
};

export const getStoreClient = () => {
  if (!redisStore) {
    logger(
      'warning',
      'service/redis: trying to use redisStore before initializing!',
    );
  }

  return redisStore;
};
