#!/bin/sh
set -e

echo "⏳ Running Prisma migrations..."
npx prisma migrate deploy

echo "🚨 Starting Incident Service..."
exec node dist/main
