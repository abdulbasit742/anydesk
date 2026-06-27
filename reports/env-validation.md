# RemoteDesk Engine Environment Validation

Status: **WARN**
Strict mode: **no**

| Variable | Required | Server-only | Present | Status |
|---|---:|---:|---:|---|
| DATABASE_URL | yes | yes | no | missing |
| JWT_SECRET | yes | yes | no | missing |
| JWT_REFRESH_SECRET | yes | yes | no | missing |
| ENGINE_ID | no | yes | no | ok |
| DASHBOARD_ENGINE_SIGNING_SECRET | no | yes | no | ok |
| ENGINE_WEBHOOK_SIGNING_SECRET | no | yes | no | ok |
| DASHBOARD_ENGINE_WEBHOOK_URL | no | yes | no | ok |
| CORS_ORIGIN | no | no | no | ok |
| WEBRTC_STUN_URLS | no | no | no | ok |
| WEBRTC_TURN_URLS | no | yes | no | ok |
| WEBRTC_TURN_USERNAME | no | yes | no | ok |
| WEBRTC_TURN_CREDENTIAL | no | yes | no | ok |
| RELEASE_MANIFEST_URL | no | no | no | ok |

No environment values are printed by this report.