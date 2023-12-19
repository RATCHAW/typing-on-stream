import chatClient from '@/twitch/chatClient';
import app from './app';
import { initializeSocket } from '@/socket/init';
import client from '@/database/redisClient';
import logger from '@/utils/logger';
import mongoose from 'mongoose';
import env from '@/env';

const server = app.listen(3000, async () => {
    logger.info('Server is running on port 3000');
    chatClient.connect();
    chatClient.onConnect(() => {
        logger.info('Chat client connected');
    });

    initializeSocket(server);

    // connect to mongodb
    mongoose.connect(env.MONGO_URL).then(() => {
        logger.info('Connected to database');
    });

    await client.connect().then(() => {
        logger.info('Connected to Redis');
    });

    setTimeout(async () => {
        console.log(await client.HGETALL('gameSessions'));
    }, 1000 * 30);
});
