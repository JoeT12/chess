import enginePool from "../engine/enginePool.js";
import { numEngines, enginePath } from "../config/env.js";

const ep = new enginePool(numEngines, enginePath);

export const engineService = {
  async getBestMove(fen, aiConfig) {
    return await ep.getBestMove(fen, aiConfig);
  },

  shutDownEngines() {
    console.log("Teminating all engines...");
    ep.quitAll();
    console.log("All engines terminated successfully.");
  },
};
