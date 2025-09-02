// Server
import express from "express";
import http from "http";

// Middleware
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../c-common/src/middleware/errorHandler.js";
import { authenticateSocket } from "./middleware/authentication.js";

// Config
import { UIEndpoint } from "../../c-common/src/config/env.js";
import { port } from "./config/env.js";

// Routes
import healthController from "./controller/healthController.js";

// Socket Resources
import { Server } from "socket.io";
import {
  closeAllChessSockets,
  registerChessSockets,
} from "./sockets/chessSockets.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: UIEndpoint },
});

app.use(
  cors({
    origin: UIEndpoint,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/health", healthController);
app.use(errorHandler);

io.use((socket, next) => {
  // On initial socket handshake, authenticate the jwt token used to open connection.
  // We only do this at the start of the connection as a socket connection is persistent,
  // and therefore we can assume that any subsequent requests made from that socket are from the same source.
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  registerChessSockets(io, socket);
});

process.on(
  "SIGINT" || "SIGTERM" || "uncaughtException" || "unhandledRejection",
  () => {
    // On any shutdown of service, close all sockets to protect against memory leaks.
    console.log("Termination request received. Shutting down gracefully...");
    closeAllChessSockets(io);
    process.exit();
  }
);

server.listen(port, () => {
  console.log("Game service running on port", port);
});
