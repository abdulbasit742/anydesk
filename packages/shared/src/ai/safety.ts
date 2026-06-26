/**
 * AI Safety & Risk Scoring Layer for RemoteDesk.
 * Adapted from AgentPulse (robot) repo.
 * Ensures AI actions on remote machines are safe, auditable, and policy-compliant.
 */

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical' | 'blocked';

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-100
  reasons: string[];
  requiresApproval: boolean;
  autoBlock: boolean;
  mitigations: string[];
}

export interface AIAction {
  type: 'command' | 'script' | 'file_operation' | 'network' | 'system' | 'registry' | 'install';
  content: string;
  targetOS: 'windows' | 'linux' | 'macos';
  targetDeviceId: string;
  requestedBy: string;
  context?: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  pattern: RegExp;
  riskLevel: RiskLevel;
  reason: string;
  mitigation?: string;
}

// High-risk command patterns
const DANGEROUS_PATTERNS: PolicyRule[] = [
  // Critical - Always block
  { id: 'rm_rf', name: 'Recursive Delete Root', pattern: /rm\s+-rf\s+\/(?!\w)/i, riskLevel: 'blocked', reason: 'Attempting to delete root filesystem' },
  { id: 'format_disk', name: 'Format Disk', pattern: /format\s+[a-z]:/i, riskLevel: 'blocked', reason: 'Attempting to format disk' },
  { id: 'dd_disk', name: 'DD to Disk', pattern: /dd\s+.*of=\/dev\/[sh]d/i, riskLevel: 'blocked', reason: 'Direct disk write operation' },
  { id: 'drop_tables', name: 'Drop All Tables', pattern: /DROP\s+(DATABASE|TABLE)/i, riskLevel: 'blocked', reason: 'Database destruction command' },
  { id: 'disable_firewall', name: 'Disable Firewall', pattern: /(netsh.*firewall.*off|ufw\s+disable|iptables\s+-F)/i, riskLevel: 'critical', reason: 'Disabling system firewall' },
  { id: 'disable_av', name: 'Disable Antivirus', pattern: /(Set-MpPreference.*DisableRealtimeMonitoring|systemctl\s+stop.*clamav)/i, riskLevel: 'critical', reason: 'Disabling antivirus protection' },

  // High risk - Requires approval
  { id: 'shutdown', name: 'System Shutdown', pattern: /(shutdown|poweroff|halt|init\s+0)/i, riskLevel: 'high', reason: 'System shutdown command', mitigation: 'Confirm with user before executing' },
  { id: 'reboot', name: 'System Reboot', pattern: /(reboot|restart|init\s+6)/i, riskLevel: 'high', reason: 'System reboot command', mitigation: 'Save all work before executing' },
  { id: 'user_delete', name: 'Delete User', pattern: /(userdel|net\s+user.*\/delete)/i, riskLevel: 'high', reason: 'Deleting user account' },
  { id: 'registry_edit', name: 'Registry Modification', pattern: /(reg\s+(add|delete)|regedit)/i, riskLevel: 'high', reason: 'Modifying system registry', mitigation: 'Create registry backup first' },
  { id: 'service_stop', name: 'Stop Critical Service', pattern: /(systemctl\s+stop|net\s+stop|sc\s+stop).*(sshd|docker|nginx|apache|mysql|postgres)/i, riskLevel: 'high', reason: 'Stopping critical service' },
  { id: 'chmod_777', name: 'World Writable', pattern: /chmod\s+777/i, riskLevel: 'high', reason: 'Setting world-writable permissions' },

  // Medium risk - Log and proceed
  { id: 'install_pkg', name: 'Install Package', pattern: /(apt\s+install|yum\s+install|pip\s+install|npm\s+install\s+-g|choco\s+install)/i, riskLevel: 'medium', reason: 'Installing software package' },
  { id: 'network_config', name: 'Network Config Change', pattern: /(ifconfig|ip\s+addr|netsh\s+interface)/i, riskLevel: 'medium', reason: 'Modifying network configuration' },
  { id: 'cron_edit', name: 'Cron Job Modification', pattern: /(crontab|schtasks)/i, riskLevel: 'medium', reason: 'Modifying scheduled tasks' },
  { id: 'env_var', name: 'Environment Variable', pattern: /(export\s+|setx\s+|SET\s+.*=)/i, riskLevel: 'low', reason: 'Setting environment variable' },

  // Low risk - Just log
  { id: 'file_read', name: 'File Read', pattern: /(cat|type|more|less|head|tail)\s+/i, riskLevel: 'safe', reason: 'Reading file content' },
  { id: 'list_files', name: 'List Files', pattern: /(ls|dir|find|where)\s+/i, riskLevel: 'safe', reason: 'Listing files' },
];

// Sensitive file paths
const SENSITIVE_PATHS = [
  /\/etc\/passwd/i,
  /\/etc\/shadow/i,
  /\/etc\/sudoers/i,
  /\.ssh\/.*key/i,
  /\.env/i,
  /credentials/i,
  /secrets?\.ya?ml/i,
  /\.aws\/credentials/i,
  /System32\\config/i,
  /SAM|SECURITY|SYSTEM/i,
];

/**
 * Assess risk of an AI action before execution.
 */
export function assessRisk(action: AIAction): RiskAssessment {
  const reasons: string[] = [];
  const mitigations: string[] = [];
  let maxScore = 0;
  let maxLevel: RiskLevel = 'safe';
  let autoBlock = false;
  let requiresApproval = false;

  // Check against dangerous patterns
  for (const rule of DANGEROUS_PATTERNS) {
    if (rule.pattern.test(action.content)) {
      reasons.push(`[${rule.id}] ${rule.reason}`);
      if (rule.mitigation) mitigations.push(rule.mitigation);

      const levelScore = riskLevelToScore(rule.riskLevel);
      if (levelScore > maxScore) {
        maxScore = levelScore;
        maxLevel = rule.riskLevel;
      }

      if (rule.riskLevel === 'blocked') autoBlock = true;
      if (rule.riskLevel === 'high' || rule.riskLevel === 'critical') requiresApproval = true;
    }
  }

  // Check for sensitive file access
  for (const pathPattern of SENSITIVE_PATHS) {
    if (pathPattern.test(action.content)) {
      reasons.push(`Accessing sensitive file path: ${pathPattern.source}`);
      maxScore = Math.max(maxScore, 60);
      maxLevel = maxScore >= 60 ? 'high' : maxLevel;
      requiresApproval = true;
      mitigations.push('Ensure user has explicit permission to access this file');
    }
  }

  // Check for piped commands (potential command injection)
  const pipeCount = (action.content.match(/\|/g) || []).length;
  if (pipeCount > 3) {
    reasons.push(`Complex piped command chain (${pipeCount} pipes) - potential injection risk`);
    maxScore = Math.max(maxScore, 50);
    maxLevel = 'medium';
  }

  // Check for download + execute patterns
  if (/curl.*\|\s*(bash|sh|python)/i.test(action.content) || /wget.*&&.*(chmod|bash|sh)/i.test(action.content)) {
    reasons.push('Download and execute pattern detected - potential malware vector');
    maxScore = Math.max(maxScore, 80);
    maxLevel = 'critical';
    requiresApproval = true;
    mitigations.push('Download file first, inspect content, then execute separately');
  }

  // Check for base64 encoded commands (obfuscation)
  if (/base64\s+-d|echo.*\|\s*base64/i.test(action.content)) {
    reasons.push('Base64 encoded command detected - possible obfuscation');
    maxScore = Math.max(maxScore, 70);
    maxLevel = 'high';
    requiresApproval = true;
  }

  // Default safe if nothing flagged
  if (reasons.length === 0) {
    reasons.push('No risk patterns detected');
  }

  return {
    level: maxLevel,
    score: maxScore,
    reasons,
    requiresApproval,
    autoBlock,
    mitigations,
  };
}

/**
 * Convert risk level to numeric score.
 */
function riskLevelToScore(level: RiskLevel): number {
  switch (level) {
    case 'safe': return 0;
    case 'low': return 20;
    case 'medium': return 40;
    case 'high': return 70;
    case 'critical': return 90;
    case 'blocked': return 100;
  }
}

/**
 * Create an audit log entry for an AI action.
 */
export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: AIAction;
  assessment: RiskAssessment;
  executed: boolean;
  result?: string;
  approvedBy?: string;
}

const auditLog: AuditEntry[] = [];

export function logAIAction(action: AIAction, assessment: RiskAssessment, executed: boolean, result?: string, approvedBy?: string): void {
  auditLog.push({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date(),
    action,
    assessment,
    executed,
    result,
    approvedBy,
  });

  // Keep only last 10000 entries in memory
  if (auditLog.length > 10000) auditLog.splice(0, auditLog.length - 10000);
}

export function getAuditLog(limit: number = 100): AuditEntry[] {
  return auditLog.slice(-limit).reverse();
}

/**
 * Policy engine — check if an action is allowed by organization policy.
 */
export interface OrgPolicy {
  allowedCommands: RegExp[];
  blockedCommands: RegExp[];
  maxRiskLevel: RiskLevel;
  requireApprovalAbove: RiskLevel;
  allowedHours: { start: number; end: number } | null;
  allowedDays: number[]; // 0=Sun, 6=Sat
}

export function checkPolicy(action: AIAction, policy: OrgPolicy): { allowed: boolean; reason: string } {
  // Check blocked commands
  for (const pattern of policy.blockedCommands) {
    if (pattern.test(action.content)) {
      return { allowed: false, reason: `Command matches blocked pattern: ${pattern.source}` };
    }
  }

  // Check allowed hours
  if (policy.allowedHours) {
    const hour = new Date().getHours();
    if (hour < policy.allowedHours.start || hour > policy.allowedHours.end) {
      return { allowed: false, reason: `AI actions not allowed outside ${policy.allowedHours.start}:00-${policy.allowedHours.end}:00` };
    }
  }

  // Check allowed days
  if (policy.allowedDays.length > 0) {
    const day = new Date().getDay();
    if (!policy.allowedDays.includes(day)) {
      return { allowed: false, reason: 'AI actions not allowed on this day' };
    }
  }

  return { allowed: true, reason: 'Action passes all policy checks' };
}

export default {
  assessRisk,
  logAIAction,
  getAuditLog,
  checkPolicy,
  DANGEROUS_PATTERNS,
};
