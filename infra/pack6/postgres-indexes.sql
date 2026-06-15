CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_counters_team_resource_window ON usage_counters(team_id, resource, window_start, window_end);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entitlements_team_feature ON entitlements(team_id, feature);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_integrity_team_verified ON audit_integrity(team_id, verified_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_exports_subject_created ON data_exports(subject_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deletion_queue_subject_status ON deletion_queue(subject_id, status);
