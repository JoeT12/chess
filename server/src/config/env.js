import dotenv from "dotenv";
dotenv.config();

export const numChessEngines = process.env.NUM_ENGINES || 4;

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
