import { Server, Socket } from 'socket.io';
import gameLobby from '@/game/gameLobby';
import { handleVerifyBroadcaster } from '@/socket/events/verifyBroadcaster';

export function initializeSocket(server: any) {
    const io = new Server(server);

    io.on('connection', (socket: Socket) => {
        // const game = new gameLobby();
        console.log('A user connected, lobby created');

        // Handle a 'join' event
        // socket.on('join', (data) => {
        //     const { username } = data;
        //     game.join(username);
        // });

        handleVerifyBroadcaster(socket);

        socket.on('message', (message) => {
            console.log(message);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
