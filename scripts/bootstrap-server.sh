#!/usr/bin/env sh
set -eu

PROJECT_DIR=/opt/projects/mikhail-digital-garage
REPOSITORY=https://github.com/skylinegtr030-web/mikhail-digital-garage.git
CADDY_SITE=/opt/infrastructure/caddy/sites-enabled/30-mikhail-digital-garage.caddy
DOMAIN=garage.84.201.143.53.nip.io

if [ ! -d "$PROJECT_DIR/.git" ]; then
  mkdir -p "$PROJECT_DIR"
  git clone "$REPOSITORY" "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"
git fetch origin main
git reset --hard origin/main

if ! docker network inspect web >/dev/null 2>&1; then
  docker network create web
fi

docker compose build --pull
docker compose up -d --remove-orphans

attempt=0
until [ "$(docker inspect --format='{{.State.Health.Status}}' mikhail-digital-garage-web 2>/dev/null || true)" = "healthy" ]; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 40 ]; then
    docker compose logs --tail=150 web
    exit 1
  fi
  sleep 3
done

sudo install -m 0644 "$PROJECT_DIR/deploy/caddy/30-mikhail-digital-garage.caddy" "$CADDY_SITE"
docker exec caddy caddy validate --config /etc/caddy/Caddyfile

cd /opt/infrastructure
docker compose up -d --force-recreate caddy

attempt=0
until curl -fsS "https://$DOMAIN/api/health" >/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 40 ]; then
    echo "Site did not respond: https://$DOMAIN"
    exit 1
  fi
  sleep 3
done

echo "Deployment complete: https://$DOMAIN"
