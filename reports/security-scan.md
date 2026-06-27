# RemoteDesk Engine Security Scan

Status: **PASS**
Findings: **3**
Blocking P0 findings: **0**

| Severity | Pattern | File | Line | Allowed | Preview |
|---|---|---|---:|---:|---|
| P0 | jwt-secret | apps/api/.env.example | 3 | yes | JWT_SECRET="change-this-...[REDACTED]" |
| P0 | jwt-secret | infra/docker/docker-compose.prod.yml | 14 | yes |       - JWT_SECRET=${JWT_SECRET} |
| P0 | jwt-secret | infra/scripts/setup.sh | 17 | yes |   JWT_SECRET=$(openssl rand -hex 64) |

Secret values are redacted in this report.