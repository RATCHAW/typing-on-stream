import { ChatClient } from '@twurple/chat';
import Game from './game';
import logger from '@/utils/logger';

class GameLobby {
    private games: Map<string, Game> = new Map();
    async create(channelName: string, lobbyId: string): Promise<void> {
        const game = new Game(new ChatClient());

        await game.createNewGame(channelName, lobbyId);

        logger.info(`Joined ${channelName}`);
    }

    removeListener(lobbyId: string): void {
        const game = this.games.get(lobbyId);
        if (game) {
            game.removeListener();
        }
    }
}

const gameLobby = new GameLobby();

export default gameLobby;
