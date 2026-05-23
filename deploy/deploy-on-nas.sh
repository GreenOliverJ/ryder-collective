#!/bin/sh
# Run on the Synology NAS after git pull (manual or via GitHub Actions self-hosted runner).
set -e

if [ -n "$RYDER_DEPLOY_DIR" ]; then
  DEPLOY_DIR="$RYDER_DEPLOY_DIR"
else
  for candidate in \
    /volume2/docker/ryder-collective \
    /volume1/docker/ryder-collective \
    /volume3/docker/ryder-collective
  do
    if [ -d "$candidate/.git" ] || [ -f "$candidate/docker-compose.prod.yml" ]; then
      DEPLOY_DIR="$candidate"
      break
    fi
  done
fi

if [ -z "$DEPLOY_DIR" ] || [ ! -d "$DEPLOY_DIR" ]; then
  echo "Cannot find ryder-collective. Clone the repo first, or set:"
  echo "  export RYDER_DEPLOY_DIR=/volumeX/docker/ryder-collective"
  echo "See deploy/synology/FIND-YOUR-PATH.md"
  exit 1
fi

COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.production"

cd "$DEPLOY_DIR"

if [ ! -f .env.production ]; then
  echo "Missing .env.production — copy from .env.production.example and edit."
  exit 1
fi

echo "==> Deploying from $DEPLOY_DIR"
echo "==> Pulling latest main..."
git fetch origin main
git reset --hard origin/main

echo "==> Building and starting containers..."
$COMPOSE up -d --build

echo "==> Done. Open PUBLIC_URL from .env.production"
$COMPOSE ps
