import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';
import redisClient from '@/database/redisClient';
import adjustDifficulty from './difficulty';
import { EventEmitter } from 'events';

class Game {
    private wordsTimeouts = new Map<string, NodeJS.Timeout>();
    private wordGenerateTimoutId: NodeJS.Timeout | null = null;

    private running: boolean = false;
    public score: number = 0;
    private difficulty = adjustDifficulty(this.score);
    public channelUsername: string | undefined;
    public eventEmitter: EventEmitter = new EventEmitter();

    public startGame(channelUsername: string): string {
        if (!this.running) {
            this.channelUsername = channelUsername;
            this.running = true;
            this.runGameLoop(channelUsername);
            return 'Game started';
        } else {
            return 'Game already running';
        }
    }

    public async stopGame(word?: string): Promise<string | boolean> {
        if (!this.running) {
            return 'Game is not running';
        }
        this.running = false;
        this.score = 0;

        if (this.wordGenerateTimoutId !== null) {
            clearTimeout(this.wordGenerateTimoutId);
            this.wordGenerateTimoutId = null;
        }

        // Clear cached words
        await redisClient.DEL(`words:${this.channelUsername}`);

        // Clear timeouts for each word
        this.wordsTimeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.wordsTimeouts.clear();
        return word ? this.eventEmitter.emit('gameOver', { status: 'Game over', word }) : 'Game stopped';
    }

    private runGameLoop(channel: string): void {
        if (!this.running) {
            return;
        }
        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval } = this.difficulty;
        this.wordGenerateTimoutId = setTimeout(
            async () => {
                const word = generateWord({
                    minLength: wordMinLength,
                    maxLength: wordMaxLength,
                });

                const isSaved = await redisClient.SADD(`words:${channel}`, word);

                if (isSaved) {
                    this.eventEmitter.emit('newWord', word);

                    this.wordsTimeouts.set(
                        word,
                        setTimeout(() => {
                            this.eventEmitter.emit('wordTimout', word);
                            this.stopGame(word);
                        }, wordTimeout),
                    );
                }
                this.runGameLoop(channel);
            },
            getRandomInterval(wordInterval[0], wordInterval[1]),
        );
    }

    async removeMatchedWords(word: string): Promise<void> {
        if (!this.running) {
            return;
        }
        const wordExist = await redisClient.SISMEMBER(`words:${this.channelUsername}`, word);
        if (wordExist) {
            this.eventEmitter.emit('destroyedWord', word);
            const timeout = this.wordsTimeouts.get(word);
            clearTimeout(timeout);
            this.wordsTimeouts.delete(word);

            await redisClient.SREM(`words:${this.channelUsername}`, word);
            this.score += 1;
        }
    }
}

export default Game;
