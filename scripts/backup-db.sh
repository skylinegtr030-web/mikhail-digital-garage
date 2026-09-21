#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

set -a
. ./.env
set +a

DB_USER=${POSTGRES_USER:?POSTGRES_USER is required}
DB_NAME=${POSTGRES_DB:?POSTGRES_DB is required}
BACKUP_DIR=${BACKUP_DIR:-/opt/backups/mikhail-digital-garage}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-14}
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILE="$BACKUP_DIR/${DB_NAME}_$STAMP.dump"

mkdir -p "$BACKUP_DIR"
docker compose exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" --format=custom --no-owner --no-acl > "$FILE"
find "$BACKUP_DIR" -type f -name '*.dump' -mtime "+$RETENTION_DAYS" -delete

echo "$FILE"
