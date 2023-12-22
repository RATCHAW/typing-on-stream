import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
import Game from '@/game/game';
import { gameChatClient } from '@/twitch/chatClients';

export async function handleGameOverlay(socket: Socket) {
    const workspace = socket.nsp.name;
    const sessionId = workspace.split('/')[2];

    const session = await redisClient.HGET('sessions', sessionId);
    if (session) {
        socket.emit('error', { error: 'session already exist' });
        socket.disconnect();
    } else {
        const broadcaster = await Broadcaster.findOne({ sessionId }).exec();

        if (broadcaster) {
            await redisClient.HSET('sessions', sessionId, broadcaster.username);
            socket.emit('success', { message: 'session created' });
            new Game();

            socket.on('disconnect', async () => {
                gameChatClient.part(broadcaster.username);
                await redisClient.HDEL('sessions', sessionId);
            });
        } else {
            socket.emit('error', { error: 'broadcaster not found' });
        }
    }
}
