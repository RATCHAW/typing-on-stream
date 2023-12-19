import { Socket } from 'socket.io';
import chatClient from '@/twitch/chatClient';
import redisClient from '@/database/redisClient';
import gameLobby from '@/game/gameLobby';
import Broadcaster from '@/database/models/broadcaster';
import { nanoid } from 'nanoid';

function generateFourDigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export function handleVerifyBroadcaster(socket: Socket) {
    socket.on('broadcaster', async (data) => {
        const { broadcaster } = data;
        try {
            await chatClient.join(broadcaster);
            const code = generateFourDigitNumber();

            // code expires in 2 minutes
            await redisClient.SET(`verificationFor:${socket.id}:channel:${broadcaster}`, code, { EX: 60 * 2 });
            socket.emit('code', { code });
        } catch (e) {
            socket.emit('error', { error: 'Not a valid channel username' });
        }
    });

    const codeVerificationListener = chatClient.onMessage(async (channel, user, message, msg) => {
        // On message sent get the verification code from redis if it matches the message we send sessionId link

        const verificationCode = await redisClient.GET(`verificationFor:${socket.id}:channel:${channel}`);
        if (msg.userInfo.isBroadcaster && message === verificationCode) {
            const broadcaster = await Broadcaster.findOne({ username: channel }).exec();
            const sessionLifeTime = 60 * 60 * 24;
            if (broadcaster) {
                socket.emit('verified', { sessionId: broadcaster.sessionId });
                await redisClient.SET(`sessionId:${broadcaster.sessionId}`, channel);

                //TODO: give option to change sessionId id with new one

                await gameLobby.create(channel, broadcaster.sessionId);

                await redisClient.SET(`sessionId:${broadcaster.sessionId}`, channel, { EX: sessionLifeTime });
            } else {
                const newSessionId = nanoid();
                const newBroadcaster = new Broadcaster({
                    username: channel,
                    sessionId: newSessionId,
                });
                await newBroadcaster.save();
                await gameLobby.create(channel, newSessionId);

                socket.emit('verified', { sessionId: newSessionId });
                await redisClient.HSET('gameSessions', `sessionId:${newSessionId}`, channel);
            }

            chatClient.part(channel);

            await redisClient.DEL(`verificationFor:${socket.id}:channel:${channel}`);
            chatClient.removeListener(codeVerificationListener);
        }
    });

    socket.on('disconnect', () => {
        //TOTO channel.part('channel') quit channel

        chatClient.removeListener(codeVerificationListener);
    });
}
