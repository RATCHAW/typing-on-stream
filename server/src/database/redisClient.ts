import { createClient } from 'redis';
import env from '../env';
import logger from '@/utils/logger';

const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.info('Redis Client Error', err));

export default redisClient;
