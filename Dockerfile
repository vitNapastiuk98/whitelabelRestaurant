FROM node:22.23.2-bookworm-slim AS build
WORKDIR /app
ENV MONGOMS_DISABLE_POSTINSTALL=1
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm ci --prefix client --include=dev && npm ci --prefix server --include=dev
COPY package.json ./
COPY scripts ./scripts
COPY client ./client
COPY server/tsconfig.json ./server/
COPY server/src ./server/src
RUN npm run build

FROM node:22.23.2-bookworm-slim AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build --chown=node:node /app/server/dist ./dist
COPY --from=build --chown=node:node /app/server/public ./public
USER node
EXPOSE 3000
CMD ["sh", "-c", "node dist/seed.js && exec node dist/main.js"]
