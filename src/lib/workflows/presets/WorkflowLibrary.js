// WorkflowLibrary.js — Catalog hosting workflow templates for quick onboarding
import { LlmOptimizeStep } from './LlmOptimize.js';
import { MultiBroadcastStep } from './MultiBroadcast.js';
import { SecurityAuditStep } from './SecurityAudit.js';
import { AutoSaveStep } from './AutoSave.js';
import { CoolDownStep } from './CoolDown.js';
import { AuthHandshakeStep } from './AuthHandshake.js';

const WORKFLOW_TEMPLATES = [
  {
    id: 'full-broadcast',
    name: 'Full Broadcast Pipeline',
    description: 'Optimize → Authenticate → Broadcast → Cool-Down → Save',
    icon: '📡',
    steps: [LlmOptimizeStep.id, AuthHandshakeStep.id, MultiBroadcastStep.id, CoolDownStep.id, AutoSaveStep.id],
    tags: ['broadcast', 'production'],
  },
  {
    id: 'security-scan',
    name: 'Security Posture Scan',
    description: 'Audit all credentials and key rotation status',
    icon: '🔒',
    steps: [SecurityAuditStep.id],
    tags: ['security', 'audit'],
  },
  {
    id: 'quick-send',
    name: 'Quick Send',
    description: 'Fast broadcast without optimization steps',
    icon: '⚡',
    steps: [AuthHandshakeStep.id, MultiBroadcastStep.id],
    tags: ['quick', 'broadcast'],
  },
];

const STEP_REGISTRY = {
  [LlmOptimizeStep.id]: LlmOptimizeStep,
  [MultiBroadcastStep.id]: MultiBroadcastStep,
  [SecurityAuditStep.id]: SecurityAuditStep,
  [AutoSaveStep.id]: AutoSaveStep,
  [CoolDownStep.id]: CoolDownStep,
  [AuthHandshakeStep.id]: AuthHandshakeStep,
};

export function getWorkflow(id) { return WORKFLOW_TEMPLATES.find(w => w.id === id) || null; }
export function getAllWorkflows() { return [...WORKFLOW_TEMPLATES]; }
export function getStep(id) { return STEP_REGISTRY[id] || null; }
export function resolveWorkflowSteps(workflowId) {
  const wf = getWorkflow(workflowId);
  if (!wf) return [];
  return wf.steps.map(id => STEP_REGISTRY[id]).filter(Boolean);
}
export function searchWorkflows(query) {
  const q = query.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(w => w.name.toLowerCase().includes(q) || w.tags.some(t => t.includes(q)));
}
