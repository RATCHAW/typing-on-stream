import io from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL;

const socketVerify = io(`${apiUrl}/verify`, { autoConnect: false });

const currentURL = window.location.href;
const lastSegment = currentURL.substring(currentURL.lastIndexOf('/') + 1);

const socketGame = io(`${apiUrl}/game/${lastSegment}`);

export { socketVerify, socketGame };
