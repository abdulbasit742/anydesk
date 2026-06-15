CREATE INDEX IF NOT EXISTS idx_audit_logs_team_occurred ON "AuditLog" ("teamId", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS idx_session_events_session_occurred ON "SessionEvent" ("sessionId", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_team_status ON "SupportTicket" ("teamId", "status", "updatedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user_occurred ON "SecurityEvent" ("userId", "occurredAt" DESC);
