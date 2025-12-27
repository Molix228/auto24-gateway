# Build stage
FROM node:23.10-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN yarn install --frozen-lockfile
COPY . . 
RUN yarn build && \
    yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# Production stage
FROM node:23.10-alpine
WORKDIR /app

# 1. Устанавливаем зависимости (curl для healthcheck)
RUN apk add --no-cache dumb-init curl

# 2. Безопасность: создаем пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 3. Синхронизируем порт с нашим docker-compose (3333)
ENV NODE_ENV=production \
    PORT=3333 \
    NODE_OPTIONS="--max-old-space-size=512"

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs
EXPOSE 3333

# 4. Проверьте, что в NestJS есть роут /health/live
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3333/health/live || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/src/main.js"]