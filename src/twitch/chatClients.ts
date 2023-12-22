import logger from '@/utils/logger';
import { ChatClient } from '@twurple/chat';

export const verificationChatClient = new ChatClient({});

export async function connectChatClients() {
    verificationChatClient.connect();
    verificationChatClient.onConnect(() => {
        logger.info('Connected to verification chat client');
    });
}
