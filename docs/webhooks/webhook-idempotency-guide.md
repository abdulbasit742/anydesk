# Idempotency

## Key
Each event has unique `event_id`.

## Handling
Store processed IDs.
Skip duplicates.
Expire after 24 hours.
