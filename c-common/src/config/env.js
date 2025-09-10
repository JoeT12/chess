import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

export const UIEndpoint = process.env.UI_ENDPOINT || "http://localhost:3000";
export const AuthServiceEndpoint =
  process.env.AUTH_SERVICE_ENDPOINT || "http://localhost:8081";
export const GameServiceEndpoint =
  process.env.GAME_SERVICE_ENDPOINT || "http://localhost:8082";
export const EngineServiceEndpoint =
  process.env.ENGINE_SERVICE_ENDPOINT || "http://localhost:8083";

export const numDatabaseThreads = process.env.NUM_DATABASE_THREADS || 10;

export const databaseHost = process.env.DATABASE_HOST || "localhost";
export const databaseName = process.env.DATABASE_NAME || "chess_db";
export const databaseUser = process.env.DATABASE_USER || "josephtaylor";
export const databasePassword = process.env.DATABASE_PASSWORD || "password";
export const databasePort = process.env.DATABASE_PORT || 5432;

export const JWTPublicKey = fs.readFileSync(
  path.join(__dirname, "public.key"),
  "utf8"
);

export const env = process.env.ENV || "development";
