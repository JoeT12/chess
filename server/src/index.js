import {
  closeAllChessSockets,
  registerChessSockets,
} from "./sockets/chessSockets.js";
import { shutDownEngines } from "./services/chessService.js";
import healthRoutes from "./routes/healthRoutes.js";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { UIEndpoint } from "./config/env.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(
  cors({
    origin: UIEndpoint,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/api/health", healthRoutes);

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

server.listen(8081, () => {
  console.log("server running at http://localhost:8081");
});
