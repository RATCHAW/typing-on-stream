import { Socket } from 'socket.io';
import chatClient from '@/twitch/chatClient';
import client from '@/redisClient';
import gameLobby from '@/game/gameLobby';

function generateFourDigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export function handleVerifyBroadcaster(socket: Socket) {
    socket.on('broadcaster', async (data) => {
        const { broadcaster } = data;
        try {
            await chatClient.join(broadcaster);
            const code = generateFourDigitNumber();

            // expire in 2 minutes
            await client.set(socket.id + broadcaster, code, { EX: 60 * 2 });
            socket.emit('code', { code });
        } catch (e) {
            socket.emit('error', { error: 'Not a valid channel name' });
        }
    });

    const executeCommandListener = chatClient.onMessage(async (channel, user, message, msg) => {
        const verificationCode = await client.get(socket.id + channel);
        if (msg.userInfo.isBroadcaster && message === verificationCode) {
            socket.emit('verified', { verified: true });
            chatClient.part(channel);
            gameLobby.join(channel);
            chatClient.removeListener(executeCommandListener);
        }
    });

    socket.on('disconnect', () => {
        //TOTO channel.part('channel') quit channel

        chatClient.removeListener(executeCommandListener);
        client.del(socket.id);
    });
}
