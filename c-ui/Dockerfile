
FROM node:18-alpine AS builder
WORKDIR /app

COPY c-ui/package*.json ./
RUN npm ci

COPY c-ui/ .

# Unfortunately these have to be baked into the image as the NextJs client can't retrieve pod env vars at runtime.
ENV NEXT_PUBLIC_AUTH_SERVER_HOST=https://chess.local/auth
ENV NEXT_PUBLIC_GAME_SERVER_HOST=https://chess.local/game
ENV NEXT_PUBLIC_ENGINE_SERVER_HOST=https://chess.local/engine

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]