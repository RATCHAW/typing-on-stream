import { ChatClient } from '@twurple/chat';
import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';
import redisClient from '@/redisClient';

class Game {
    // private words: Map<string, number> = new Map();
    private running: boolean = false;
    private timeoutId: NodeJS.Timeout | null = null;

    // in game related properties
    private readonly fps: number = 30;
    private readonly screenHight: number = 1080;
    private score: number = 0;
    private wordSpeed: number = 1;

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
        this.chatClient.onMessage((channel, user, message, msg) => {
            if (msg.userInfo.isBroadcaster || user == 'ratchaw') {
                if (message == '!start' && !this.running) {
                    this.startGame(channel);
                    console.log(`game started on ${channel}`);
                }
                if (message == '!stop' && this.running) {
                    this.stopGame(channel);
                    console.log(`game stopped on ${channel}`);
                }
            }
        });
    }

    //if message match the word in the set, delete it
    compareWords() {
        this.chatClient.onMessage(async (channel, user, message) => {
            if (!this.running) {
                return;
            }
            const word = await redisClient.SISMEMBER(`words:${channel}`, message);
            if (word) {
                redisClient.SREM(`words:${channel}`, message);
                this.score += 1;
                console.log(`score: ${this.score}`);
            }
        });
    }

    startGame(channel: string) {
        this.running = true;
        this.runGameLoop(channel);
        this.compareWords();
    }

    stopGame(channel: string) {
        this.running = false;

        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        //clera the set
        redisClient.DEL(`words:${channel}`);
    }

    private runGameLoop(channel: string) {
        if (this.running) {
            this.timeoutId = setTimeout(
                () => {
                    const word = generateWord({ minLength: 3, maxLength: 5 });
                    console.log(word);
                    redisClient.SADD(`words:${channel}`, word);
                    this.runGameLoop(channel);
                },
                getRandomInterval(2000, 3000),
            );
        }
    }
}

export default Game;
