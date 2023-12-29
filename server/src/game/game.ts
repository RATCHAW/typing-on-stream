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

interface Word {
    clientData: {
        id: string;
        word: string;
        wordShake: boolean;
        toBeDestroyed: number;
        wordTimeout: number;
    };
    internalData: {
        wordTimeoutId: NodeJS.Timeout;
    };
}

class Game {
    private words = new Map<string, Word>();
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
        this.words.forEach((word) => {
            clearTimeout(word.internalData.wordTimeoutId);
        });
        this.words.clear();
        return word ? this.eventEmitter.emit('gameOver', { status: 'Game over', word }) : GameState.Stopped;
    }

    private runGameLoop(channel: string): void {
        if (!this.running) return;

        const { wordMinLength, wordMaxLength, wordTimeout, wordInterval, wordShake, toBeDestroyed } = adjustDifficulty(
            this.score,
        );
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

                const wordTimeoutId = setTimeout(() => {
                    this.eventEmitter.emit('wordTimout', generatedWord);
                    this.stopGame(generatedWord);
                }, wordTimeout);

                const clientData = {
                    id: nanoid(),
                    word: generatedWord,
                    wordShake,
                    toBeDestroyed,
                    wordTimeout,
                };

                const internalData = {
                    wordTimeoutId,
                };

                this.words.set(generatedWord, { clientData, internalData });
                this.eventEmitter.emit('newWord', clientData);
                this.runGameLoop(channel);
            },
            getRandomInterval(wordInterval.min, wordInterval.max),
        );
    }

    async removeMatchedWords(word: string): Promise<void> {
        if (!this.running) return;

        //used to remove empty spaces added my 7TV exestension
        const cleanString = word.split(' ')[0];
        const wordExist = this.words.get(cleanString);
        console.log(wordExist);
        if (wordExist) {
            this.score += 1;
            wordExist.clientData.toBeDestroyed--;
            if (wordExist.clientData.toBeDestroyed === 0) {
                this.words.delete(cleanString);
            }
            this.eventEmitter.emit('destroyedWord', wordExist.clientData);
            clearTimeout(wordExist.internalData.wordTimeoutId);
        }
    }
}

export default Game;
