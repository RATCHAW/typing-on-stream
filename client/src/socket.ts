import io from "socket.io-client";

const apiUrl = "http://localhost:3000";

const socketVerify = io(`${apiUrl}/verify`);

export { socketVerify };
