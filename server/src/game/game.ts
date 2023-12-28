import getRandomInterval from './randomInterval';
import { generateWord } from './wordGenerator';
import redisClient from '@/database/redisClient';
import adjustDifficulty from './difficulty';
import { EventEmitter } from 'events';

enum GameState {
    NotRunning = 'Game is not running',
    Started = 'Game started',
    AlreadyRunning = 'Game already running',
    Stopped = 'Game stopped',
    GameOver = 'Game over',
}

class Game {
    private wordsTimeouts = new Map<string, NodeJS.Timeout>();
    private wordGenerateTimoutId: NodeJS.Timeout | null = null;

    private running: boolean = false;
    public score: number = 0;
    public channelUsername: string | undefined;
    public eventEmitter: EventEmitter = new EventEmitter();

    public startGame(channelUsername: string): string {
        if (!this.running) {
            this.channelUsername = channelUsername;
            this.running = true;
            this.runGameLoop(channelUsername);
            return GameState.Started;
        } else {
            return GameState.AlreadyRunning;
        }
    }

    public async stopGame(word?: string): Promise<string | boolean> {
        if (!this.running) {
            return GameState.NotRunning;
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
        return word ? this.eventEmitter.emit('gameOver', { status: 'Game over', word }) : GameState.Stopped;
    }

    private runGameLoop(channel: string): void {
        if (!this.running) {
            return;
        }
        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval, wordShake } = adjustDifficulty(this.score);
        this.wordGenerateTimoutId = setTimeout(
            async () => {
                const generatedWord = generateWord({
                    minLength: wordMinLength,
                    maxLength: wordMaxLength,
                });

                const isSaved = await redisClient.SADD(`words:${channel}`, generatedWord);
                const wordAndDifficulties = {
                    word: generatedWord,
                    wordTimeout,
                    wordShake,
                };

                if (isSaved) {
                    this.eventEmitter.emit('newWord', wordAndDifficulties);

                    this.wordsTimeouts.set(
                        generatedWord,
                        setTimeout(() => {
                            this.eventEmitter.emit('wordTimout', generatedWord);
                            this.stopGame(generatedWord);
                        }, wordTimeout),
                    );
                }
                this.runGameLoop(channel);
            },
            getRandomInterval(wordInterval.min, wordInterval.max),
        );
    }

    async removeMatchedWords(word: string): Promise<void> {
        if (!this.running) {
            return;
        }
        const wordExist = await redisClient.SISMEMBER(`words:${this.channelUsername}`, word);
        if (wordExist) {
            this.score += 1;
            this.eventEmitter.emit('destroyedWord', word, this.score);
            const timeout = this.wordsTimeouts.get(word);
            clearTimeout(timeout);
            this.wordsTimeouts.delete(word);

            await redisClient.SREM(`words:${this.channelUsername}`, word);
        }
    }
}

export default Game;
