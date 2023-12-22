import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';
import redisClient from '@/database/redisClient';
import adjustDifficulty from './difficulty';
import { EventEmitter } from 'events';

class Game {
    private wordsTimeouts = new Map<string, NodeJS.Timeout>();
    private running: boolean = false;
    private wordGenerateTimoutId: NodeJS.Timeout | null = null;

    public score: number = 0;
    private difficulty = adjustDifficulty(this.score);
    public channelUsername: string | undefined;
    public eventEmitter: EventEmitter = new EventEmitter();

    public startGame(channelUsername: string): boolean {
        this.channelUsername = channelUsername;
        this.running = true;
        this.runGameLoop(channelUsername);
        return true;
    }

    public async stopGame(channel: string, gameOver?: boolean): Promise<string | { message: string; error: boolean }> {
        if (!this.running) {
            return { message: 'Game is not running', error: true };
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
        return { message: 'Game stopped', error: false };
    }

    private runGameLoop(channel: string): void {
        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval } = this.difficulty;

        this.wordGenerateTimoutId = setTimeout(
            async () => {
                const word = generateWord({
                    minLength: wordMinLength,
                    maxLength: wordMaxLength,
                });

                await redisClient.SADD(`words:${channel}`, word);

                this.eventEmitter.emit('newWord', word);

                this.wordsTimeouts.set(
                    word,
                    setTimeout(() => {
                        this.eventEmitter.emit('wordTimout', word);
                        this.stopGame(channel, true);
                    }, wordTimeout),
                );

                this.runGameLoop(channel);
            },
            getRandomInterval(wordInterval[0], wordInterval[1]),
        );
    }

    async removeMatchedWords(word: string): Promise<string | undefined> {
        if (!this.running) {
            return;
        }
        const wordExist = await redisClient.SISMEMBER(`words:${this.channelUsername}`, word);
        if (wordExist) {
            const timeout = this.wordsTimeouts.get(word);
            clearTimeout(timeout);
            this.wordsTimeouts.delete(word);

            await redisClient.SREM(`words:${this.channelUsername}`, word);
            this.score += 1;
            return word;
        }
    }
}

export default Game;
