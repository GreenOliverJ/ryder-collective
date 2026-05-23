#!/usr/bin/env sh
# Backup MongoDB from the production compose stack.
# Usage: ./deploy/backup-mongo.sh [output-file]

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/data/backups/ryder-$(date +%Y%m%d-%H%M%S).archive}"
mkdir -p "$(dirname "$OUT")"

cd "$ROOT"
docker compose -f docker-compose.prod.yml exec -T mongodb \
  mongodump --archive --db=ryder > "$OUT"

echo "Backup written to: $OUT"
