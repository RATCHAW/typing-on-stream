import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';
import redisClient from '@/database/redisClient';
import adjustDifficulty from './difficulty';
import logger from '@/utils/logger';
import { gameChatClient } from '@/twitch/chatClients';
import { Socket } from 'socket.io';

class Game {
    private wordsTimeouts = new Map<string, NodeJS.Timeout>();
    private running: boolean = false;
    private wordGenerateTimoutId: NodeJS.Timeout | null = null;

    // in game related properties
    private score: number = 0;
    private difficulty = adjustDifficulty(this.score);

    constructor(
        private channelUsername: string,
        private socket: Socket,
    ) {
        this.createNewGame(channelUsername);
        logger.info(`Joined ${channelUsername}`);
    }

    private async createNewGame(channelUsername: string) {
        try {
            await gameChatClient.join(channelUsername);
            gameChatClient.onMessage((channel, user, message, msg) => {
                // checks if the message is coming from the channel that the game was created on,
                if (msg.userInfo.isBroadcaster && channel === channelUsername) {
                    if (message == '!start' && !this.running) {
                        this.startGame(channelUsername);
                    }
                    if (message == '!stop' && this.running) {
                        this.stopGame(channelUsername);
                    }
                }
            });
        } catch (error) {
            logger.error(error);
        }
    }

    private startGame(channelUsername: string) {
        logger.info(`game started on ${channelUsername}`);
        this.socket.emit('gameStatus', { channelUsername, status: 'Game started' });
        this.running = true;
        this.runGameLoop(channelUsername);
        this.checkAndRemoveMatchedWords();
    }

    private async stopGame(channel: string, gameOver?: boolean) {
        if (gameOver) {
            logger.info(`game over on ${channel}`);
            this.socket.emit('gameStatus', { channel, status: 'Game over' });
        } else {
            logger.info(`game stopped on ${channel}`);
            this.socket.emit('gameStatus', { channel, status: 'Game stopped' });
        }
        this.running = false;
        this.score = 0;

        if (this.wordGenerateTimoutId !== null) {
            clearTimeout(this.wordGenerateTimoutId);
            this.wordGenerateTimoutId = null;
        }

        // Clear cached words
        await redisClient.DEL(`words:${channel}`);

        // Clear timeouts for each word
        this.wordsTimeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.wordsTimeouts.clear();
    }

    private runGameLoop(channel: string) {
        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval } = this.difficulty;
        if (this.running) {
            this.wordGenerateTimoutId = setTimeout(
                async () => {
                    const word = generateWord({
                        minLength: wordMinLength,
                        maxLength: wordMaxLength,
                    });
                    logger.info(word);
                    this.socket.emit('word', { word: word });
                    const myObj = {
                        word: word,
                        difficulty: adjustDifficulty(this.score),
                    };
                    logger.info(myObj);
                    await redisClient.SADD(`words:${channel}`, word);

                    this.wordsTimeouts.set(
                        word,
                        setTimeout(() => {
                            logger.info(`Timeout for word: ${word}`);
                            this.socket.emit('wordTimeout', { word: word });
                            this.stopGame(channel, true);
                        }, wordTimeout),
                    );

                    this.runGameLoop(channel);
                },
                getRandomInterval(wordInterval[0], wordInterval[1]),
            );
        }
    }

    private checkAndRemoveMatchedWords() {
        gameChatClient.onMessage(async (channel, user, message) => {
            if (!this.running) {
                return;
            }
            const wordExist = await redisClient.SISMEMBER(`words:${this.channelUsername}`, message);
            if (wordExist) {
                const timeout = this.wordsTimeouts.get(message);
                if (timeout) {
                    clearTimeout(timeout);
                    this.wordsTimeouts.delete(message);
                }

                await redisClient.SREM(`words:${this.channelUsername}`, message);
                this.score += 1;
                logger.info(`score: ${this.score}`);
                this.socket.emit('score', { score: this.score });
            }
        });
    }
}

export default Game;
