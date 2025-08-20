import dotenv from "dotenv";
dotenv.config();

export const numChessEngines = process.env.NUM_ENGINES || 4;
export const numDatabaseThreads = process.env.NUM_DATABASE_CONNECTIONS || 10;
export const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS || 5;

export const UIEndpoint = process.env.UI_ENDPOINT || "http://localhost:3000";

export const databaseHost = process.env.DATABASE_HOST || "localhost";
export const databaseName = process.env.DATABASE_NAME || "chess_db";
export const databaseUser = process.env.DATABASE_USER || "josephtaylor";
export const databasePassword = process.env.DATABASE_PASSWORD || "password";
export const databasePort = process.env.DATABASE_PORT || 5432;

export const JWTPrivateKey = process.env.JWT_PRIVATE_KEY || "1234";
export const JWTTokenTTL = process.env.JWT_TOKEN_TTL || "30m";
export const RefreshTokenTTL = parseInt(
  process.env.REFRESH_TOKEN_TTL_DAYS || "7",
  10
);

export const easyAI = {
  skill: process.env.EASY_AI_SKILL || 5,
  depth: process.env.EASY_AI_DEPTH || 8,
};

export const mediumAI = {
  skill: process.env.MEDIUM_AI_SKILL || 10,
  depth: process.env.MEDIUM_AI_DEPTH || 15,
};

export const hardAI = {
  skill: process.env.HARD_AI_SKILL || 20,
  depth: process.env.HARD_AI_DEPTH || 25,
};
