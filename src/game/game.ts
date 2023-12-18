import { ChatClient } from '@twurple/chat';
import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';
import redisClient from '@/database/redisClient';
import adjustDifficulty from './difficulty';
import logger from '@/utils/logger';

class Game {
    private timeouts = new Map<string, NodeJS.Timeout>();
    private running: boolean = false;
    private timeoutId: NodeJS.Timeout | null = null;

    // in game related properties
    private score: number = 0;
    private difficulty = adjustDifficulty(this.score);

    constructor(private chatClient: ChatClient) {}

    async joinChat(channelName: string) {
        try {
            this.chatClient.connect();
            await this.chatClient.join(channelName);
            this.commandsListener();
        } catch (error) {
            logger.error(error);
        }
    }

    commandsListener() {
        this.chatClient.onMessage((channel, user, message, msg) => {
            if (msg.userInfo.isBroadcaster) {
                if (message == '!start' && !this.running) {
                    this.startGame(channel);
                }
                if (message == '!stop' && this.running) {
                    this.stopGame(channel);
                }
            }
        });
    }

    startGame(channel: string) {
        logger.info(`game started on ${channel}`);
        this.running = true;
        this.runGameLoop(channel);
        this.checkAndRemoveMatchedWords();
    }

    async stopGame(channel: string, gameOver?: boolean) {
        if (gameOver) {
            logger.info(`game over on ${channel}`);
        } else {
            logger.info(`game stopped on ${channel}`);
        }
        this.running = false;

        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        await redisClient.DEL(`words:${channel}`);
        this.timeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.timeouts.clear();
    }

    private runGameLoop(channel: string) {
        if (this.running) {
            this.timeoutId = setTimeout(
                async () => {
                    const word = generateWord({
                        minLength: this.difficulty.wordMinLength,
                        maxLength: this.difficulty.wordMaxLength,
                    });
                    logger.info(word);
                    const myObj = {
                        word: word,
                        difficulty: adjustDifficulty(this.score),
                    };
                    logger.info(myObj);
                    await redisClient.SADD(`words:${channel}`, word);

                    this.timeouts.set(
                        word,
                        setTimeout(() => {
                            logger.info(`Timeout for word: ${word}`);
                            this.stopGame(channel, true);
                        }, this.difficulty.wordTimeout),
                    );

                    this.runGameLoop(channel);
                },
                getRandomInterval(this.difficulty.wordInterval[0], this.difficulty.wordInterval[1]),
            );
        }
    }

    // Check if the incoming message is a member of the Redis set for the current channel.
    // If it is, clear the timeout for the word, remove the word from the Redis set, and increment the score.
    checkAndRemoveMatchedWords() {
        this.chatClient.onMessage(async (channel, user, message) => {
            if (!this.running) {
                return;
            }
            const wordExist = await redisClient.SISMEMBER(`words:${channel}`, message);
            if (wordExist) {
                const timeout = this.timeouts.get(message);
                if (timeout) {
                    clearTimeout(timeout);
                    this.timeouts.delete(message);
                }

                await redisClient.SREM(`words:${channel}`, message);
                this.score += 1;
                logger.info(`score: ${this.score}`);
            }
        });
    }
}

export default Game;
