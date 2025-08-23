import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(accessToken: string) {
  console.log("Getting socket with access token:", accessToken);
  if (!socket) {
    socket = io("http://localhost:8081", {
      autoConnect: false,
      reconnection: false,
      query: { token: accessToken },
    });
  }
  return socket;
}

export default socket;
