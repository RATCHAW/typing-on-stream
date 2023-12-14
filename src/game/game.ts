import { ChatClient } from '@twurple/chat';
import getRandomInterval from './utils/randomInterval';
import { generateWord } from './utils/wordGenerator';

class Game {
    running: boolean = false;
    private timeoutId: NodeJS.Timeout | null = null;
    constructor(private chatClient: ChatClient = new ChatClient()) {}

    join(channel: string) {
        this.chatClient.join(channel);
        console.log(`Joined channel ${channel}`);
    }

    start() {
        this.running = true;
        this.runGame();
    }

    stop() {
        this.running = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    private runGame() {
        if (this.running) {
            this.timeoutId = setTimeout(
                () => {
                    const word = generateWord({ minLength: 3, maxLength: 5 });
                    console.log(word);
                    this.runGame();
                },
                getRandomInterval(500, 1000),
            );
        }
    }
}

export default Game;
