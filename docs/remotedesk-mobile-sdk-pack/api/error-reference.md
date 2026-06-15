# API Error Reference

| Code | HTTP | Meaning | Action |
|------|------|---------|--------|
| validation_error | 400 | Bad request | Check payload |
| unauthorized | 401 | Token invalid | Refresh or re-login |
| forbidden | 403 | No permission | Request access |
| not_found | 404 | Resource missing | Verify ID |
| conflict | 409 | Duplicate | Retry with new data |
| rate_limited | 429 | Too many requests | Backoff and retry |
| server_error | 5xx | Internal error | Retry with exponential backoff |
| network_error | 0 | Fetch failed | Check connectivity |
| timeout | 0 | Request timed out | Retry or increase timeout |
