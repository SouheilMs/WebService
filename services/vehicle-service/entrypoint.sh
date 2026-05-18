#!/bin/sh
set -e

echo "⏳ Running Prisma migrations..."
npx prisma migrate deploy

echo "🚚 Starting Vehicle Service..."
exec node dist/main
