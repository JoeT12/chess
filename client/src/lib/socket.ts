import { io, Socket } from "socket.io-client";
import { config } from "../config";

let socket: Socket | null = null;

export function getSocket(accessToken: string) {
  console.log("Getting socket with access token:", accessToken);
  if (!socket) {
    socket = io(`${config.gameServerHost}`, {
      autoConnect: false,
      reconnection: false,
      query: { token: accessToken },
    });
  }
  return socket;
}

export default socket;
