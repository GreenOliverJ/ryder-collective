#!/usr/bin/env sh
# Export local dev MongoDB and import into production compose stack.
# Usage: ./deploy/migrate-local-to-prod.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE="$ROOT/data/backups/migrate-$(date +%Y%m%d-%H%M%S).archive"
mkdir -p "$(dirname "$ARCHIVE")"

echo "Starting local MongoDB (dev compose)..."
cd "$ROOT"
docker compose up -d mongodb
sleep 2

echo "Dumping database..."
docker compose exec -T mongodb mongodump --archive --db=ryder > "$ARCHIVE"

echo "Importing into production stack..."
docker compose -f docker-compose.prod.yml --env-file .env.production up -d mongodb
sleep 3
docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --archive --drop < "$ARCHIVE"

echo "Done. Archive kept at: $ARCHIVE"
echo "Start full stack: docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
