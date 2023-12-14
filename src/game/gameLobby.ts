import { ChatClient } from '@twurple/chat';
import Game from './game';

class gameLobbys {
    join(channelName: string): void {
        const game = new Game(new ChatClient());
        game.joinChat(channelName);
    }
}

export default gameLobbys;
