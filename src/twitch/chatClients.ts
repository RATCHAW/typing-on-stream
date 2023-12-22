import logger from '@/utils/logger';
import { ChatClient } from '@twurple/chat';

export const verificationChatClient = new ChatClient({});

export const gameChatClient = new ChatClient({});

export async function connectChatClients() {
    verificationChatClient.connect();
    verificationChatClient.onConnect(() => {
        logger.info('Connected to verification chat client');
    });

    gameChatClient.connect();
    gameChatClient.onConnect(() => {
        logger.info('Connected to game chat client');
    });
}