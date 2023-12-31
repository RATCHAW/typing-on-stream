import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
import Game from '@/game/game';
import { ChatClient } from '@twurple/chat';

export async function handleGameOverlay(socket: Socket) {
    const workspace = socket.nsp;
    const sessionId = workspace.name.split('/')[2];

    const session = await redisClient.HGET('sessions', sessionId);
    console.log(workspace.sockets.size);
    if (workspace.sockets.size > 1) {
        console.log('session already exists');
        socket.emit('session', {
            created: false,
            message: ' Your session is currently active in another window or tab',
        });
        socket.disconnect();
    } else {
        const broadcaster = await Broadcaster.findOne({ sessionId }).exec();

        if (broadcaster) {
            const game = new Game();
            const gameChatClient = new ChatClient({ channels: [broadcaster.username] });
            gameChatClient.connect();
            gameChatClient.onConnect(async () => {
                await redisClient.HSET('sessions', sessionId, broadcaster.username);

                gameChatClient.onMessage(async (channel, user, message, msg) => {
                    console.log(message);
                    game.removeMatchedWords(message, msg.userInfo.displayName);
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

                game.eventEmitter.on('destroyedWord', (wordAndDifficulties, score: number, user: string) => {
                    socket.emit('destroyedWord', { wordAndDifficulties, newScore: score, user });
                });

                game.eventEmitter.on('newWord', (wordAndDifficulties) => {
                    socket.emit('newWord', wordAndDifficulties);
                });

                game.eventEmitter.on('gameOver', (status: string, word: number) => {
                    socket.emit('gameStatus', { status, word });
                });

                socket.on('disconnect', async () => {
                    console.log('disconnected');
                    gameChatClient.quit();
                    await redisClient.HDEL('sessions', sessionId);
                    socket.removeAllListeners();
                });

                socket.emit('session', { created: true, message: 'session created' });
            });
        } else {
            socket.emit('session', { created: false, message: 'session does not exist' });
            socket.disconnect();
        }
    }
}
