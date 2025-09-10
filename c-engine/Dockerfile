FROM node:18-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y curl tar build-essential git && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/official-stockfish/Stockfish.git &&\
    cd Stockfish &&\
    cd src &&\
    make help &&\
    make net &&\
    make build && \
    mv stockfish /usr/local/bin/stockfish

COPY c-common ./c-common
COPY c-engine ./c-engine

WORKDIR /app/c-common
RUN npm ci

WORKDIR /app/c-engine
RUN npm ci

EXPOSE 8083
CMD ["node", "src/index.js"]
