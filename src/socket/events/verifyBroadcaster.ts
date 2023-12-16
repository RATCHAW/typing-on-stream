// join.ts
import { Socket } from 'socket.io';
import chatClient from '@/twitch/chatClient';
import { ChatMessage, ChatUser } from '@twurple/chat';
import client from '@/redisClient';

function generateFourDigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export function handleVerifyBroadcaster(socket: Socket) {
    socket.on('broadcaster', async (data) => {
        const { broadcaster } = data;
        await chatClient.join(broadcaster);

        const code = generateFourDigitNumber();

        // expire in 2 minutes
        await client.set(socket.id, code, { EX: 60 * 2 });
        socket.emit('code', { code });
    });

    const executeCommandListener = chatClient.onMessage(async (channel, user, message, msg) => {
        const verificationCode = await client.get(socket.id);
        if (msg.userInfo.isBroadcaster && message === verificationCode?.toString()) {
            socket.emit('verified', { verified: true });
            chatClient.removeListener(executeCommandListener);
        }
    });

    socket.on('disconnect', () => {
        chatClient.removeListener(executeCommandListener);
        client.del(socket.id);
    });
}
