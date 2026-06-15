CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_residency_policy_tenant ON data_residency_policies(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenant_region_assignments_tenant_region ON tenant_region_assignments(tenant_id, region);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_encryption_keys_tenant_status ON encryption_keys(tenant_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_residency_audit_tenant_occurred ON residency_audit(tenant_id, occurred_at DESC);
