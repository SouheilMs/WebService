FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY services/incident-service/package*.json ./services/incident-service/
COPY shared/package.json ./shared/package.json
RUN npm install --include=dev --workspace=services/incident-service --workspace=shared --no-audit --no-fund

COPY shared ./shared
COPY services/incident-service ./services/incident-service
RUN npm run build --workspace=shared
WORKDIR /app/services/incident-service
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/services/incident-service/dist ./dist
COPY --from=builder /app/services/incident-service/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/services/incident-service/package.json ./package.json
COPY --from=builder /app/services/incident-service/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./entrypoint.sh"]
