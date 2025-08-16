import Engine from "./engineService.js";

export default class EnginePool {
  constructor(size = 2, path = "stockfish") {
    this.pool = Array.from({ length: size }, () => new Engine(path));
    this.nextIndex = 0;
  }

  getEngine() {
    const engine = this.pool[this.nextIndex];
    this.nextIndex = (this.nextIndex + 1) % this.pool.length;
    return engine;
  }

  async getBestMove(fen, AIConfig) {
    const engine = this.getEngine();
    return engine.getBestMove(fen, AIConfig);
  }

  quitAll() {
    this.pool.forEach((e) => e.quit());
  }
}
