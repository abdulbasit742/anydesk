# Redis rate limit notes

Use Redis or another shared store for API and Socket.IO rate limits when running more than one API replica.
Local memory rate limits are only acceptable for development and single-instance staging.
Keys should include team ID, user ID and IP hash where possible.
