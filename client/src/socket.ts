import io from 'socket.io-client';

// let { sessionId } = useParams();

const apiUrl = 'http://localhost:3000';

const socketVerify = io(`${apiUrl}/verify`, { autoConnect: false });

const socketGame = (sessionId: string) => {
  return io(`${apiUrl}/game/${sessionId}`);
};

export { socketVerify, socketGame };
