import { ChatClient } from '@twurple/chat';
import Game from './game';

class gameLobbys {
    async join(channelName: string): Promise<void> {
        const game = new Game(new ChatClient());
        await game.joinChat(channelName);
        console.log(`Joined ${channelName}`);
    }
}

export default new gameLobbys();
