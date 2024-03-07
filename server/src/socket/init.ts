import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { handleVerifyBroadcaster } from '@/socket/events/verifyBroadcaster';
import { handleGameOverlay } from './events/gameOverlay';
import env from '@/env';

export class ServerSocket {
    public io: Server;

    constructor(server: HTTPServer) {
        this.io = new Server(server, {
            cors: {
                origin: env.CORS_ORIGIN,
            },
        });
        this.io.of('/verify').on('connection', this.VerifyBroadcaster);
        this.io.of(/^\/game\/(.+)$/).on('connection', this.GameOverlay);
    }

    VerifyBroadcaster(socket: Socket) {
        handleVerifyBroadcaster(socket);
    }

    GameOverlay(socket: Socket) {
        handleGameOverlay(socket);
    }
}
