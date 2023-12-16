import { ChatClient, ChatMessage } from '@twurple/chat';
import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';

class Game {
    private words: Map<string, number> = new Map();
    private readonly fps: number = 30;
    private running: boolean = false;
    private timeoutId: NodeJS.Timeout | null = null;
    private intervalId: NodeJS.Timeout | null = null;

    private score: number = 0;
    private speed: number = 1;

    constructor(private chatClient: ChatClient) {}

    async joinChat(channelName: string) {
        try {
            this.chatClient.connect();
            await this.chatClient.join(channelName);
            console.log(`Joined ${channelName}`);
            this.commandsListener();
        } catch (error) {
            console.log(error);
        }
    }

    commandsListener() {
        this.chatClient.onMessage((channel, user, message) => {
            if (channel === user || user == 'ratchaw') {
                if (message == '!start' && !this.running) {
                    this.startGame();
                    console.log(`game started on ${channel}`);
                }
                if (message == '!stop' && this.running) {
                    this.stopGame();
                    console.log(`game stopped on ${channel}`);
                }
            }
        });
    }

    //if message match the word in the set, delete it
    compareWords() {
        this.chatClient.onMessage((channel, user, message) => {
            if (!this.running) {
                return;
            }
            if (this.words.has(message)) {
                this.words.delete(message);
                console.log(`Deleted ${message}`);
            }
        });
    }

    startGame() {
        this.running = true;
        this.runGameLoop();
        this.compareWords();
        this.updatePositions();
    }

    stopGame() {
        this.running = false;

        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.words.clear();
    }

    private runGameLoop() {
        if (this.running) {
            this.timeoutId = setTimeout(
                () => {
                    const word = generateWord({ minLength: 3, maxLength: 5 });
                    if (!this.words.has(word)) {
                        // If the word doesn't exist in the set
                        this.words.set(word, 0); // Add it to the set
                        console.log(word);
                    }
                    this.runGameLoop();
                },
                getRandomInterval(2000, 3000),
            );
        }
    }

    updatePositions() {
        this.intervalId = setInterval(() => {
            this.words.forEach((position, word) => {
                console.log('interval is running');
                this.words.set(word, position + 100);

                if (position > 1080) {
                    console.log('game lost');
                    this.stopGame();
                }
            });
        }, 1000 / this.fps);
    }
}

export default Game;
