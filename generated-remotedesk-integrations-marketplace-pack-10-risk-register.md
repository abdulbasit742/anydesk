| Risk | Severity | Mitigation |
| --- | --- | --- |
| OAuth token leak | Critical | encrypted secret manager, no desktop exposure |
| SSRF via webhook URL | Critical | HTTPS/local URL blocking |
| Connector route exposed | High | integration admin auth |
| Webhook retry storm | Medium | bounded backoff |
| SIEM export PII | High | redaction and audit |
