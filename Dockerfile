# ---------- build stage ----------
FROM node:20-slim AS build
WORKDIR /app

# install deps
COPY package*.json prisma ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build && npm run build-server && npx prisma generate

# ---------- runtime image ----------
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN npm prune --production
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 4000
ENTRYPOINT ["/entrypoint.sh"]
