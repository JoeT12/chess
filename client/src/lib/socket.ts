import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:8081", {
      autoConnect: false,
      reconnection: false,
    });
  }
  return socket;
}

export default socket;
