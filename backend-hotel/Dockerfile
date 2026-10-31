# Build stage
FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY prisma7.config.ts ./prisma7.config.ts
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build


# Runtime stage
FROM node:24-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application
COPY --from=build --chown=node:node /app/dist ./dist

# Copy generated Prisma runtime files
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
