import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

export const port = process.env.PORT || 8081;

export const JWTPrivateKey = fs.readFileSync(
  path.join(__dirname, "private.key"),
  "utf8"
);
export const JWTTokenTTL = process.env.JWT_TOKEN_TTL || "30m";
export const RefreshTokenTTL = parseInt(
  process.env.REFRESH_TOKEN_TTL_DAYS || "7",
  10
);
export const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 5;
