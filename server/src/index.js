import {
  closeAllChessSockets,
  registerChessSockets,
} from "./sockets/chessSockets.js";
import { shutDownEngines } from "./services/chessService.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { UIEndpoint, port } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { authenticateSocket } from "./middleware/authentication.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
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
app.use(cookieParser()); // before your route
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

io.use((socket, next) => {
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  registerChessSockets(io, socket);
});

process.on(
  "SIGINT" || "SIGTERM" || "uncaughtException" || "unhandledRejection",
  () => {
    console.log("Termination request received. Shutting down gracefully...");
    closeAllChessSockets(io);
    shutDownEngines();
    process.exit();
  }
);

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
