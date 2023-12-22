import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
// import { gameChatClient } from '@/twitch/chatClients';
import Game from '@/game/game';
import { ChatClient } from '@twurple/chat';

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
            const game = new Game();
            const gameChatClient = new ChatClient({ channels: [broadcaster.username] });
            gameChatClient.connect();
            gameChatClient.onConnect(async () => {
                await redisClient.HSET('sessions', sessionId, broadcaster.username);
                socket.emit('success', { message: 'session created' });
            });

            gameChatClient.onMessage(async (channel, user, message, msg) => {
                const destroyedWord = await game.removeMatchedWords(message);

                if (destroyedWord) {
                    socket.emit('destroyedWord', { destroyedWord });
                }

                if (msg.userInfo.isBroadcaster && channel === broadcaster.username) {
                    if (message == '!start') {
                        const status = game.startGame(broadcaster.username);
                        socket.emit('gameStatus', { status });
                    }
                    if (message == '!stop') {
                        const status = await game.stopGame();
                        socket.emit('gameStatus', { status });
                    }
                }
            });

            game.eventEmitter.on('newWord', (word) => {
                socket.emit('newWord', { word });
            });

            game.eventEmitter.on('gameOver', (status, word) => {
                socket.emit('gameStatus', { status, word });
            });

            socket.on('disconnect', async () => {
                gameChatClient.quit();
                await redisClient.HDEL('sessions', sessionId);
            });
        } else {
            socket.emit('error', { error: 'broadcaster not found' });
        }
    }
}
