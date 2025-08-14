const Engine = require('./engine');

class EnginePool {
  constructor(size = 2, path = 'stockfish') {
    this.pool = Array.from({ length: size }, () => new Engine(path));
    this.nextIndex = 0;
  }

  getEngine() {
    const engine = this.pool[this.nextIndex];
    this.nextIndex = (this.nextIndex + 1) % this.pool.length;
    return engine;
  }

  async getBestMove(fen, depth = 15) {
    const engine = this.getEngine();
    return engine.getBestMove(fen, depth);
  }

  quitAll() {
    this.pool.forEach(e => e.quit());
  }
}

module.exports = EnginePool;