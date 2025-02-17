# Stage 1: Build the React app using a Node.js image
FROM node:20.16 AS reactbuild

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY docker/env.ts src/env.ts

RUN npm run build:client
RUN npm run build:server


# Stage 2: Copy the built React app and the server to an Alpine image
FROM node:20.16-alpine

WORKDIR /root

COPY --from=reactbuild /app/dist ./dist
COPY --from=reactbuild /app/package*.json ./

RUN npm ci --omit=dev

COPY server.js ./

EXPOSE $FRONTEND_PORT
CMD ["node", "server"]
