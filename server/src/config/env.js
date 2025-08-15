import dotenv from "dotenv";
dotenv.config();

export const numChessEngines = process.env.NUM_ENGINES || 4;