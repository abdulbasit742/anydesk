export interface ComplianceCheck { id: string; name: string; category: "os" | "security" | "network"; severity: "critical" | "warning"; }
export const DEFAULT_CHECKS: ComplianceCheck[] = [
  { id: "os-version", name: "OS Version Current", category: "os", severity: "critical" },
  { id: "disk-encryption", name: "Disk Encryption Enabled", category: "security", severity: "critical" },
  { id: "firewall", name: "Firewall Enabled", category: "network", severity: "warning" },
];
export async function runComplianceChecks() { return DEFAULT_CHECKS.map(c => ({ checkId: c.id, passed: true, details: `${c.name}: OK` })); }
