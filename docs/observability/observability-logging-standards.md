# Logging Standards

## Format
Structured JSON

## Required Fields
- timestamp (ISO 8601)
- level (ERROR, WARN, INFO, DEBUG)
- service
- message
- trace_id

## Prohibited
- PII in plain text
- Passwords
- Tokens
