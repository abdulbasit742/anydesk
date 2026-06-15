CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_members_org_user ON org_members(organization_id, user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_departments_org_path ON departments(organization_id, path);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_report_runs_org_key_created ON report_runs(organization_id, report_key, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enterprise_audit_org_occurred ON enterprise_audit(organization_id, occurred_at DESC);
