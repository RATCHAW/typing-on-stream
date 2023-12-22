import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
import logger from '@/utils/logger';
import Game from '@/game/game';
import { gameChatClient } from '@/twitch/chatClients';

export async function handleGameOverlay(socket: Socket) {
    const workspace = socket.nsp.name;
    const sessionId = workspace.split('/')[2];

    const session = await redisClient.HGET('sessions', sessionId);
    if (session) {
        socket.emit('error', { error: 'session already exist' });
        socket.disconnect();
        logger.error(`Session ${sessionId} already exist`);
    } else {
        const broadcaster = await Broadcaster.findOne({ sessionId }).exec();

        if (broadcaster) {
            socket.join(`gameOverlay/${sessionId}`);
            await redisClient.HSET('sessions', sessionId, broadcaster.username);
            socket.emit('success', { message: 'session created' });
            const game = new Game(broadcaster.username, socket);

            logger.info(`Session ${sessionId} for ${broadcaster.username} created`);

            socket.on('disconnect', async () => {
                gameChatClient.part(broadcaster.username);
                await redisClient.HDEL('sessions', sessionId);
                logger.info(`Session ${sessionId} deleted`);
            });
        } else {
            socket.emit('error', { error: 'broadcaster not found' });
        }
    }
}
