import getRandomInterval from './randomInterval';
import { generateWord } from './wordGenerator';
import adjustDifficulty from './difficulty';
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { LeaderBoardStoring, broadcasterHighestScore } from './leaderboard';

enum GameState {
    NotRunning = 'game is not running',
    Started = 'started',
    AlreadyRunning = 'game already running',
    Stopped = 'stopped',
    GameOver = 'over',
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
    public highestScore: number = 0;
    public channelUsername: string;
    public eventEmitter: EventEmitter = new EventEmitter();

    constructor(channelUsername: string) {
        this.channelUsername = channelUsername;
    }

    public async getHighestScore() {
        this.highestScore = await broadcasterHighestScore(this.channelUsername);
        return this.highestScore;
    }

    public async startGame() {
        if (!this.running) {
            this.running = true;
            this.runGameLoop(this.channelUsername);
            this.eventEmitter.emit('gameStatus', GameState.Started);
        } else {
            this.eventEmitter.emit('gameStatus', GameState.AlreadyRunning);
        }
    }

    public async stopGame(word?: string): Promise<string | boolean> {
        if (!this.running) {
            return GameState.NotRunning;
        }
        LeaderBoardStoring(this.channelUsername!, this.score);
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
        return word
            ? this.eventEmitter.emit('gameStatus', GameState.GameOver, word)
            : this.eventEmitter.emit('gameStatus', GameState.Stopped);
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

    async removeMatchedWords(word: string, user: string): Promise<void> {
        if (!this.running) return;

        const wordExist = this.words.get(word);
        if (wordExist) {
            this.score += 1;
            wordExist.clientData.toBeDestroyed--;
            if (wordExist.clientData.toBeDestroyed === 0) {
                this.words.delete(word);
            }
            this.eventEmitter.emit('destroyedWord', wordExist.clientData, this.score, user);
            clearTimeout(wordExist.internalData.wordTimeoutId);
        }
    }
}

export default Game;
