import { ChatClient } from '@twurple/chat';
import Game from './game';

class GameManager {
    private games: Map<string, Game> = new Map();

    constructor(private chatClient: ChatClient = new ChatClient()) {}

    listen() {
        this.chatClient.connect();
        this.chatClient.onMessage((channel, user, message) => {
            // Check if the user is the broadcaster
            if (user === channel) {
                if (message === '!start') {
                    console.log(`new game started for channel ${channel}`);
                    this.start(channel);
                } else if (message === '!stop') {
                    console.log(`game stopped for channel ${channel}`);
                    this.stop(channel);
                }
            }
        });
    }

    async join(channel: string) {
        await this.chatClient.join(channel);
        console.log(`Joined channel ${channel}`);
    }

    start(channel: string) {
        // Check if the game is already running
        let game = this.games.get(channel);
        if (!game) {
            game = new Game();
            this.games.set(channel, game);
        }
        game.start();
    }

    stop(channel: string) {
        const game = this.games.get(channel);
        if (game) {
            game.stop();
        }
    }
}

export default GameManager;
