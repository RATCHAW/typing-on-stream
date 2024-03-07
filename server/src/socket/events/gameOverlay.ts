import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
import Game from '@/game/game';
import { ChatClient } from '@twurple/chat';
import { leaderBoardRetrieving, broadcasterHighestScore } from '@/game/leaderboard';

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
            await redisClient.HSET('sessions', sessionId, broadcaster.username);
            const game = new Game();
            const gameChatClient = new ChatClient({ channels: [broadcaster.username] });
            gameChatClient.connect();
            gameChatClient.onConnect(async () => {
                gameChatClient.onMessage(async (channel, user, message, msg) => {
                    //used to remove empty spaces added by 7TV exestension
                    const cleanMessage = message.split(' ')[0];
                    console.log(cleanMessage);
                    game.removeMatchedWords(cleanMessage, msg.userInfo.displayName);
                    if (msg.userInfo.isBroadcaster && channel === broadcaster.username) {
                        if (cleanMessage == '!start') {
                            game.startGame(broadcaster.username);
                        }
                        if (cleanMessage == '!stop') {
                            game.stopGame();
                        }
                    }
                });

                const leaderboard = await leaderBoardRetrieving();
                socket.emit('leaderboard', leaderboard, game.highestScore);

                game.eventEmitter.on('destroyedWord', (wordAndDifficulties, score: number, user: string) => {
                    socket.emit('destroyedWord', { wordAndDifficulties, newScore: score, user });
                });

                game.eventEmitter.on('newWord', (wordAndDifficulties) => {
                    socket.emit('newWord', wordAndDifficulties);
                });

                game.eventEmitter.on('gameStatus', (status: string, word?: number) => {
                    word ? socket.emit('gameStatus', { status, word }) : socket.emit('gameStatus', { status });
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
