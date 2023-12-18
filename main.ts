import chatClient from '@/twitch/chatClient';
import app from './app';
import { initializeSocket } from '@/socket/init';
import client from '@/database/redisClient';

const server = app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    chatClient.connect();
    chatClient.onConnect(() => {
        console.log('Chat client connected');
    });

    initializeSocket(server);

    await client.connect().then(() => {
        console.log('Connected to Redis');
    });
});
