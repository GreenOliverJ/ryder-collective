#!/bin/sh
# Rebuild and restart Ryder app containers after you have already pulled code.
# MongoDB is left running. Use deploy/deploy-on-nas.sh to pull + deploy in one step.
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
  echo "Cannot find ryder-collective. Set:"
  echo "  export RYDER_DEPLOY_DIR=/volumeX/docker/ryder-collective"
  exit 1
fi

COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.production"

cd "$DEPLOY_DIR"

if [ ! -f .env.production ]; then
  echo "Missing .env.production"
  exit 1
fi

echo "==> Rebuilding backend + web from $DEPLOY_DIR"
$COMPOSE up -d --build backend web

echo "==> Done"
$COMPOSE ps backend web
