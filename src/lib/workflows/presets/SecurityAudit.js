// SecurityAudit.js — Steps validating credentials posture across active projects
import { auditAllKeys } from '../../security/FipsAudit.js';
import { KeyRotator } from '../../security/KeyRotator.js';

export const SecurityAuditStep = {
  id: 'security-audit',
  name: 'Security Posture Audit',
  type: 'audit',
  description: 'Validates FIPS/GDPR compliance and key rotation status across all accounts',
  icon: '🔒',

  async execute(payload) {
    const { accounts = [] } = payload;
    const alerts = [];

    const rotator = new KeyRotator(alert => alerts.push(alert));
    accounts.forEach(a => {
      if (a.apiKey && a.keyCreatedAt) {
        rotator.registerKey(a.id, a.keyCreatedAt, a.platform, a.label);
      }
    });

    const fipsResults = auditAllKeys(accounts);
    const rotationStats = rotator.getStats();

    const criticalIssues = alerts.filter(a => a.level === 'critical').length;
    const warnings = alerts.filter(a => a.level === 'warn').length;
    const score = Math.max(0, 100 - criticalIssues * 20 - warnings * 5);

    return {
      score,
      status: criticalIssues > 0 ? 'critical' : warnings > 0 ? 'warning' : 'pass',
      fipsResults,
      rotationStats,
      alerts,
      summary: `${fipsResults.filter(r => r.audit.compliant).length}/${accounts.length} accounts compliant`,
    };
  },
};
