import { Server, Socket } from 'socket.io';
import gameLobby from '@/game/gameLobby';
import { handleVerifyBroadcaster } from '@/socket/events/verifyBroadcaster';

export function initializeSocket(server: any) {
    const io = new Server(server);

    io.on('connection', (socket: Socket) => {
        handleVerifyBroadcaster(socket);
    });
}
