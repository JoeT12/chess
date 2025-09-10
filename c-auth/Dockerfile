FROM node:18-alpine AS base

WORKDIR /app

COPY c-common ./c-common/
COPY c-auth ./c-auth/

WORKDIR /app/c-common
RUN npm ci

WORKDIR /app/c-auth
RUN npm ci

EXPOSE 8081
CMD ["node", "src/index.js"]