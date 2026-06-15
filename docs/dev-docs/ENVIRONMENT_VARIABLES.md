# Environment Variables Reference

## Required
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | JWT signing secret | `change-me` |
| `VITE_APP_ID` | OAuth app ID | `app-id` |
| `APP_SECRET` | OAuth app secret | `app-secret` |

## Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `LOG_LEVEL` | Log level | `info` |
| `WS_URL` | WebSocket URL | `ws://localhost:3000` |

## Feature Flags
| Variable | Description | Default |
|----------|-------------|---------|
| `FEATURE_RECORDING` | Enable recording | `false` |
| `FEATURE_SSO` | Enable SSO | `false` |
| `FEATURE_ADVANCED_ADMIN` | Advanced admin | `false` |

## External Services
| Variable | Description |
|----------|-------------|
| `STUN_SERVERS` | STUN server URLs |
| `TURN_SERVER` | TURN server URL |
| `TURN_USERNAME` | TURN credentials |
| `SMTP_HOST` | Email server |
| `SENTRY_DSN` | Error tracking |
