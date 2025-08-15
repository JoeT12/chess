import { registerChessSockets } from "./sockets/chessSockets.js";
import { shutDownEngines } from "./services/chessService.js";
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  registerChessSockets(io, socket);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down gracefully...");
  shutDownEngines();
  process.exit();
});

server.listen(8081, () => {
  console.log("server running at http://localhost:8081");
});
