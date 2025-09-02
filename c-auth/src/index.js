// Server
import express from "express";
import http from "http";

// Middleware
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "../../c-common/src/middleware/errorHandler.js";

// Routes
import healthController from "./controller/healthController.js";
import authController from "./controller/authController.js";
import userController from "./controller/userController.js";

// Config
import { port } from "./config/env.js";
import { UIEndpoint } from "../../c-common/src/config/env.js";

const app = express();
const server = http.createServer(app);

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
app.use("/api/auth", authController);
app.use("/api/user", userController);
app.use(errorHandler);

server.listen(port, () => {
  console.log("Auth service running on port", port);
});
