# Application architecture v2

## Runtime

```text
Internet
  -> Caddy (shared external network: web)
  -> Next.js application
  -> PostgreSQL 16 (private network: app_internal)
```

Only Caddy publishes host ports. PostgreSQL has no host port and is reachable only as `db:5432` from the application network.

## Application modules

- `auth`: owner/admin/editor authentication and sessions.
- `content`: pages, content blocks, settings and publishing.
- `capabilities`: live capability content and presentation data.
- `projects`: case studies and project media.
- `leads`: contact requests, statuses, assignments and notes.
- `files`: local persistent uploads and metadata.
- `analytics`: first-party events without third-party trackers.
- `audit`: immutable record of administrative mutations.

## Persistence

- PostgreSQL files: `runtime/db`.
- Uploaded assets: `runtime/uploads`.
- Logical backups: `/opt/backups/mikhail-digital-garage`.
- Secrets: `.env`, never committed.

## Security boundaries

- Database is not exposed on the host.
- Public clients never receive database credentials.
- Mutations run through validated server-side handlers.
- Session tokens are stored as hashes.
- Login and form endpoints use database-backed rate limits.
- Administrative mutations write an audit record.
- Uploads are validated by MIME type, size and generated storage key.

## Delivery sequence

1. Database and migration foundation.
2. Database client and typed repositories.
3. Authentication and initial owner bootstrap.
4. Admin shell and authorization policies.
5. Leads and Telegram notifications.
6. Content, projects and file management.
7. First-party analytics.
8. Frontend migration from hardcoded content to repositories.
