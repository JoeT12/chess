import { spawn } from "child_process";

export default class Engine {
  constructor(path = "stockfish") {
    this.path = path;
    this.process = spawn(this.path);
    this.ready = false;
    this.queue = [];

    this.process.stdout.on("data", (data) => {
      const output = data.toString();
      // Resolve queued promises on "bestmove"
      if (output.includes("bestmove")) {
        const match = output.match(/bestmove\s+(\S+)/);
        if (match && this.queue.length) {
          this.queue.shift().resolve(match[1]);
        }
      }
    });

    this.send("uci");
    this.send("isready");
  }

  send(cmd) {
    this.process.stdin.write(cmd + "\n");
  }

  getBestMove(fen, depth = 15) {
    return new Promise((resolve) => {
      this.queue.push({ resolve });
      this.send(`position fen ${fen}`);
      this.send(`go depth ${depth}`);
    });
  }

  quit() {
    this.send("quit");
    this.process.kill();
  }
}
