import { io, Socket } from "socket.io-client";
import { config } from "../config";

let socket: Socket | null = null;
let host = config.env === "development" ? "http://localhost:8082" : "https://chess.local";
let path = config.env === "development" ? "/socket.io" : "/game/socket.io";

export function getSocket(accessToken: string) {
  console.log("Getting socket with access token:", accessToken);
  if (!socket) {
    socket = io(host, {
      path: path, 
      autoConnect: false,
      reconnection: false,
      query: { token: accessToken },
    });
  }
  return socket;
}

export default socket;
