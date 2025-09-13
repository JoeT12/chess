FROM node:18-bullseye

WORKDIR /app

# Install Tools We Will Require To Clone From Git And Build Packages.
RUN apt-get update && apt-get install -y curl tar build-essential git && rm -rf /var/lib/apt/lists/*

# Clone Stockfish from GitHub (An Open-Source Chess Engine), Build It And Add It To The Container Path.
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
