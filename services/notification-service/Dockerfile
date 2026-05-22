FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY services/notification-service/package*.json ./services/notification-service/
COPY shared/package.json ./shared/package.json
RUN npm install --include=dev --workspace=services/notification-service --workspace=shared --no-audit --no-fund

COPY shared ./shared
COPY services/notification-service ./services/notification-service
RUN npm run build --workspace=shared
WORKDIR /app/services/notification-service
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/services/notification-service/dist ./dist
COPY --from=builder /app/services/notification-service/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/services/notification-service/package.json ./package.json
COPY --from=builder /app/services/notification-service/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3005

ENTRYPOINT ["./entrypoint.sh"]
