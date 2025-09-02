import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 8083;
export const enginePath = process.env.ENGINE_PATH || "stockfish";
export const numEngines = process.env.NUM_ENGINES || 2;
