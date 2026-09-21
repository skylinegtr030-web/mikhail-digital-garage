# Production deployment

## Target

- Server: `web-vps-1`
- Project directory: `/opt/projects/mikhail-digital-garage`
- Domain: `https://garage.84.201.143.53.nip.io`
- Container: `mikhail-digital-garage-web`
- Docker network: external `web`
- Reverse proxy: shared Caddy container

The application is never published on a host port. Caddy reaches it by container name inside the shared `web` network.

## First deployment

Run on the server:

```bash
cd /tmp
rm -rf mdg-bootstrap
git clone https://github.com/skylinegtr030-web/mikhail-digital-garage.git mdg-bootstrap
chmod +x mdg-bootstrap/scripts/bootstrap-server.sh
./mdg-bootstrap/scripts/bootstrap-server.sh
```

The script clones the production copy into `/opt/projects`, builds the image, waits for the container healthcheck, installs the Caddy site file, validates the whole Caddy configuration, recreates Caddy and verifies HTTPS.

## GitHub configuration

Repository secrets:

- `VPS_HOST` — `84.201.143.53`
- `VPS_USER` — `mikhail`
- `VPS_SSH_KEY` — private key matching the server authorized key

Repository variable, added only after the first successful deployment:

- `VPS_DEPLOY_ENABLED` — `true`

Until the variable exists, the workflow runs but the deploy job is skipped.

## Routine deploy

Each push to `main`:

1. Hard reset to `origin/main`.
2. Rebuild the Docker image.
3. Recreate the application container.
4. Wait for `/api/health`.
5. Prune unused images.

## Operations

```bash
cd /opt/projects/mikhail-digital-garage
docker compose ps
docker compose logs -f --tail=150 web
docker compose up -d --build
curl -fsS https://garage.84.201.143.53.nip.io/api/health
```

## Caddy

```bash
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
cd /opt/infrastructure && docker compose up -d --force-recreate caddy
```

The shared Caddy config uses `admin off`, so configuration changes are applied by recreating the Caddy container after a successful validation.
