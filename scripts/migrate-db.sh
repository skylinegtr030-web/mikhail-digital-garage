#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example and set secure values."
  exit 1
fi

set -a
. ./.env
set +a

DB_USER=${POSTGRES_USER:?POSTGRES_USER is required}
DB_NAME=${POSTGRES_DB:?POSTGRES_DB is required}

docker compose exec -T db psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

for migration in database/migrations/*.sql; do
  [ -f "$migration" ] || continue
  version=$(basename "$migration")
  applied=$(docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM schema_migrations WHERE version = '$version'")
  if [ "$applied" = "1" ]; then
    echo "skip $version"
    continue
  fi

  echo "apply $version"
  {
    echo 'BEGIN;'
    cat "$migration"
    printf "\nINSERT INTO schema_migrations(version) VALUES ('%s');\n" "$version"
    echo 'COMMIT;'
  } | docker compose exec -T db psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME"
done
