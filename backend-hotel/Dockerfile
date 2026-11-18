# Build
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY prisma7.config.ts ./prisma7.config.ts
COPY prisma ./prisma
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate
RUN npm run build


# Runtime
FROM node:24-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma7.config.ts ./prisma7.config.ts

USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node dist/main.js"]
