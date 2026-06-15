# Background jobs

Generated BackgroundJobRunner is intentionally small.
Use it for staging and single-process work.
For production at scale, wire jobs through a durable queue with distributed locks.
