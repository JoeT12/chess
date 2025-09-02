// Server
import express from "express";
import http from "http";

// Middleware
import cors from "cors";
import { errorHandler } from "../../c-common/src/middleware/errorHandler.js";

// Config
import { port } from "./config/env.js";
import {
  GameServiceEndpoint,
  UIEndpoint,
} from "../../c-common/src/config/env.js";

// Routes
import healthController from "./controller/healthController.js";
import engineController from "./controller/engineController.js";

// Other
import { engineService } from "./service/engineService.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [GameServiceEndpoint, UIEndpoint],
    methods: ["POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/health", healthController);
app.use("/api/engine", engineController);
app.use(errorHandler);

process.on(
  "SIGINT" || "SIGTERM" || "uncaughtException" || "unhandledRejection",
  () => {
    // On any shutdown, we attempt to shutdown all running engines, otherwise the processes running these will become orphaned.
    console.log("Termination request received. Shutting down gracefully...");
    engineService.shutDownEngines();
    process.exit();
  }
);

server.listen(port, () => {
  console.log("Engine service running on port", port);
});
