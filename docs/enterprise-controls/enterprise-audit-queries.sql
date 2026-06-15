-- Audit queries for enterprise
-- List all admin actions
SELECT * FROM audit_logs WHERE action LIKE 'admin.%' ORDER BY created_at DESC LIMIT 100;

-- List policy changes
SELECT * FROM audit_logs WHERE action = 'policy.changed' ORDER BY created_at DESC;

-- List failed login attempts
SELECT * FROM audit_logs WHERE action = 'auth.failed' AND created_at > NOW() - INTERVAL '24 hours';
