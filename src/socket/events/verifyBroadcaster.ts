import { Socket } from 'socket.io';
import redisClient from '@/database/redisClient';
import Broadcaster from '@/database/models/broadcaster';
import { nanoid } from 'nanoid';
import { verificationChatClient } from '@/twitch/chatClients';

function generateFourDigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export function handleVerifyBroadcaster(socket: Socket) {
    socket.on('broadcaster', async (data) => {
        const { broadcaster } = data;
        try {
            await verificationChatClient.join(broadcaster);
            const code = generateFourDigitNumber();
            await redisClient.SET(`verificationFor:${socket.id}:channel:${broadcaster}`, code, { EX: 60 * 2 });
            socket.emit('code', { code });
        } catch (e) {
            socket.emit('error', { error: 'Not a valid channel username' });
        }

        socket.on('disconnect', async () => {
            const verificationCode = await redisClient.GET(`verificationFor:${socket.id}:channel:${broadcaster}`);
            if (verificationCode) {
                verificationChatClient.part(broadcaster);
                await redisClient.DEL(`verificationFor:${socket.id}:channel:${broadcaster}`);
            }
        });
    });

    const codeVerificationListener = verificationChatClient.onMessage(async (channel, user, message, msg) => {
        // On message sent get the verification code from redis if it matches the message we send sessionId

        const verificationCode = await redisClient.GET(`verificationFor:${socket.id}:channel:${channel}`);
        if (msg.userInfo.isBroadcaster && message === verificationCode) {
            const broadcaster = await Broadcaster.findOne({ username: channel }).exec();
            if (broadcaster) {
                socket.emit('verified', {
                    sessionId: broadcaster.sessionId,
                    message: 'Do you want to change the session ID? (yes/no)',
                });

                // Listen for sessionId change
                socket.on('sessionChange', async function handleChangeSessionId(response) {
                    if (response.answer === 'yes') {
                        const newSessionId = nanoid();
                        broadcaster.sessionId = newSessionId;
                        await broadcaster.save();
                        socket.emit('sessionChange', { sessionId: newSessionId, message: 'Session ID changed' });
                        socket.off('sessionChange', handleChangeSessionId);
                    } else if (response.answer === 'no') {
                        socket.off('sessionChange', handleChangeSessionId);
                    } else {
                        socket.emit('sessionChange', { message: 'Invalid answer, Please enter yes or no' });
                    }
                });
            } else {
                const newSessionId = nanoid();
                const newBroadcaster = new Broadcaster({
                    username: channel,
                    sessionId: newSessionId,
                });

                await newBroadcaster.save();

                socket.emit('verified', { sessionId: newSessionId });
            }
            verificationChatClient.part(channel);
            await redisClient.DEL(`verificationFor:${socket.id}:channel:${channel}`);
            verificationChatClient.removeListener(codeVerificationListener);
        }
    });
}
