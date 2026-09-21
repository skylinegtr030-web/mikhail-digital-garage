#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 /path/to/backup.dump"
  exit 1
fi

BACKUP=$1
[ -f "$BACKUP" ] || { echo "Backup not found: $BACKUP"; exit 1; }

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

set -a
. ./.env
set +a

DB_USER=${POSTGRES_USER:?POSTGRES_USER is required}
DB_NAME=${POSTGRES_DB:?POSTGRES_DB is required}

echo "This replaces data in $DB_NAME from $BACKUP. Type RESTORE to continue:"
read answer
[ "$answer" = "RESTORE" ] || { echo "Cancelled"; exit 1; }

docker compose exec -T db pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-acl < "$BACKUP"
