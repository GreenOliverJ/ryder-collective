#!/bin/sh
# Run on the Synology NAS after git pull (manual or via GitHub Actions self-hosted runner).
set -e

DEPLOY_DIR="${RYDER_DEPLOY_DIR:-/volume1/docker/ryder-collective}"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.production"

cd "$DEPLOY_DIR"

if [ ! -f .env.production ]; then
  echo "Missing .env.production — copy from .env.production.example and edit."
  exit 1
fi

echo "==> Pulling latest main..."
git fetch origin main
git reset --hard origin/main

echo "==> Building and starting containers..."
$COMPOSE up -d --build

echo "==> Done. Open PUBLIC_URL from .env.production"
$COMPOSE ps
