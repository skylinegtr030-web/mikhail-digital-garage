# Database operations

## Initial setup

```bash
cp .env.example .env
openssl rand -base64 36
openssl rand -hex 32
```

Use the generated values for `POSTGRES_PASSWORD` and `AUTH_SECRET`. Keep `DATABASE_URL` consistent with the database password.

```bash
docker compose up -d db
chmod +x scripts/migrate-db.sh scripts/backup-db.sh scripts/restore-db.sh
./scripts/migrate-db.sh
```

## Backup

```bash
sudo mkdir -p /opt/backups/mikhail-digital-garage
sudo chown mikhail:mikhail /opt/backups/mikhail-digital-garage
./scripts/backup-db.sh
```

Suggested cron entry:

```cron
17 3 * * * cd /opt/projects/mikhail-digital-garage && ./scripts/backup-db.sh >> /var/log/mikhail-digital-garage-backup.log 2>&1
```

## Restore test

Never test restore against production first. Create a temporary database and restore the latest dump there, then run integrity checks.

```bash
./scripts/restore-db.sh /opt/backups/mikhail-digital-garage/example.dump
```

The restore script requires typing `RESTORE` before replacing data.
