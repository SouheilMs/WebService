# ────────────────────────────────────────────────────
# Stage 1: Builder
# ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install --include=dev

# Copy source & Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# ────────────────────────────────────────────────────
# Stage 2: Production image
# ────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Copy Prisma files (needed for migrations at runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy startup script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
