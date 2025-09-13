FROM node:18-alpine

WORKDIR /app

COPY db/c-db-migrate/ .

WORKDIR /app/db-migrations
RUN npm ci

CMD ["npm", "run", "migrate"]