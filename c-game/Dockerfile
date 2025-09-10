FROM node:18-alpine

WORKDIR /app

COPY c-common ./c-common
COPY c-game ./c-game

WORKDIR /app/c-common
RUN npm ci

WORKDIR /app/c-game
RUN npm ci

EXPOSE 8082
CMD ["node", "src/index.js"]