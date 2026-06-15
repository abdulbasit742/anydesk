-- Review before running in production.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_team_occurred_at ON audit_logs(team_id, occurred_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_session_events_session_at ON session_events(session_id, occurred_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_tickets_team_status ON support_tickets(team_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_team_at ON security_events(team_id, occurred_at DESC);
