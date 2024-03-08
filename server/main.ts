import redisClient from '@/database/redisClient';
import logger from '@/utils/logger';
import mongoose from 'mongoose';
import env from '@/env';
import { ServerSocket } from '@/socket/init';
import express from 'express';
import { connectChatClients } from '@/twitch/chatClients';

const app = express();

const server = app.listen(3000, async () => {
    logger.info('Server is running on port 3000');

    await redisClient.connect().then(() => {
        logger.info('Connected to Redis');
        mongoose.connect(env.MONGO_URL).then(async () => {
            logger.info('Connected to database');
            await connectChatClients();
        });
    });

    new ServerSocket(server);
});
