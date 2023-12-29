import getRandomInterval from './randomInterval';
import { generateWord } from './wordGenerator';
import adjustDifficulty from './difficulty';
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';

enum GameState {
    NotRunning = 'Game is not running',
    Started = 'Game started',
    AlreadyRunning = 'Game already running',
    Stopped = 'Game stopped',
    GameOver = 'Game over',
}

class Game {
    private wordsTimeouts = new Map<string, NodeJS.Timeout>();
    private words = new Set<string>();
    private wordGenerateTimoutId: NodeJS.Timeout | null = null; // timeout id for the next generated word

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

        //Force stop the next word generation by clearing the timeout
        if (this.wordGenerateTimoutId !== null) {
            clearTimeout(this.wordGenerateTimoutId);
            this.wordGenerateTimoutId = null;
        }

        // clear saved word and than clear timeouts for each word
        this.words.clear();
        this.wordsTimeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.wordsTimeouts.clear();
        return word ? this.eventEmitter.emit('gameOver', { status: 'Game over', word }) : GameState.Stopped;
    }

    private runGameLoop(channel: string): void {
        if (!this.running) return;

        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval, wordShake } = adjustDifficulty(this.score);
        this.wordGenerateTimoutId = setTimeout(
            () => {
                const generatedWord = generateWord({
                    minLength: wordMinLength,
                    maxLength: wordMaxLength,
                });

                if (this.words.has(generatedWord)) {
                    this.runGameLoop(channel);
                    return;
                }

                this.words.add(generatedWord);

                const wordAndDifficulties = {
                    word: generatedWord,
                    id: nanoid(),
                    wordTimeout,
                    wordShake,
                };

                this.eventEmitter.emit('newWord', wordAndDifficulties);
                this.wordsTimeouts.set(
                    generatedWord,
                    setTimeout(() => {
                        this.eventEmitter.emit('wordTimout', generatedWord);
                        this.stopGame(generatedWord);
                    }, wordTimeout),
                );

                this.runGameLoop(channel);
            },
            getRandomInterval(wordInterval.min, wordInterval.max),
        );
    }

    async removeMatchedWords(word: string): Promise<void> {
        if (!this.running) return;

        const wordExist = this.words.has(word);
        if (wordExist) {
            this.score += 1;
            this.eventEmitter.emit('destroyedWord', word, this.score);
            const timeout = this.wordsTimeouts.get(word);
            clearTimeout(timeout);
            this.wordsTimeouts.delete(word);
            this.words.delete(word);
        }
    }
}

export default Game;
