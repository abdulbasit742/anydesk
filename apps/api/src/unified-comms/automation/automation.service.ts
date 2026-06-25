/**
 * Automation & Workflows Service
 * Rule-based automation for ticket management, routing, and notifications
 */

import { randomUUID } from 'node:crypto';

export type AutomationTrigger =
  | 'ticket_created'
  | 'ticket_updated'
  | 'ticket_idle'
  | 'ticket_resolved'
  | 'csat_received'
  | 'sla_breach'
  | 'message_received'
  | 'business_hours_start'
  | 'business_hours_end'
  | 'agent_offline'
  | 'repeated_issue';

export type AutomationAction =
  | 'assign_agent'
  | 'assign_team'
  | 'change_priority'
  | 'change_status'
  | 'add_tag'
  | 'send_notification'
  | 'send_email'
  | 'send_reply'
  | 'escalate'
  | 'create_ticket'
  | 'close_ticket'
  | 'run_webhook'
  | 'send_survey';

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: unknown;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: { type: AutomationAction; params: Record<string, unknown> }[];
  enabled: boolean;
  priority: number;
  executionCount: number;
  lastExecutedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  trigger: AutomationTrigger;
  ticketId: string | null;
  actionsExecuted: string[];
  success: boolean;
  error: string | null;
  executedAt: string;
}

const rules = new Map<string, AutomationRule>();
const logs: AutomationLog[] = [];

// Default automation rules
const defaultRules: AutomationRule[] = [
  {
    id: 'rule-idle-reminder',
    name: 'Idle Ticket Reminder',
    description: 'If ticket idle > 24 hours, auto-remind agent',
    trigger: 'ticket_idle',
    conditions: [{ field: 'idle_hours', operator: 'greater_than', value: 24 }],
    actions: [{ type: 'send_notification', params: { target: 'assignee', message: 'Ticket #{number} has been idle for 24+ hours' } }],
    enabled: true,
    priority: 1,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-cancel-retention',
    name: 'Route Cancellations to Retention',
    description: 'If customer says "cancel", route to retention team',
    trigger: 'message_received',
    conditions: [{ field: 'message', operator: 'contains', value: 'cancel' }],
    actions: [{ type: 'assign_team', params: { teamId: 'team-retention' } }, { type: 'change_priority', params: { priority: 'high' } }],
    enabled: true,
    priority: 2,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-low-csat',
    name: 'Escalate Low CSAT',
    description: 'If CSAT < 3 stars, escalate to manager',
    trigger: 'csat_received',
    conditions: [{ field: 'rating', operator: 'less_than', value: 3 }],
    actions: [{ type: 'escalate', params: { target: 'manager' } }, { type: 'add_tag', params: { tag: 'low-csat' } }],
    enabled: true,
    priority: 3,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-repeated-issue',
    name: 'Auto Bug Report',
    description: 'If same issue reported 5+ times, create bug report automatically',
    trigger: 'repeated_issue',
    conditions: [{ field: 'occurrence_count', operator: 'greater_than', value: 5 }],
    actions: [{ type: 'create_ticket', params: { type: 'bug', assignTeam: 'team-engineering' } }],
    enabled: true,
    priority: 4,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-post-resolution-survey',
    name: 'Post-Resolution Survey',
    description: 'After resolution, send satisfaction survey after 1 hour',
    trigger: 'ticket_resolved',
    conditions: [],
    actions: [{ type: 'send_survey', params: { delayMinutes: 60, template: 'csat_survey' } }],
    enabled: true,
    priority: 5,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-after-hours',
    name: 'After Hours Auto-Reply',
    description: 'Auto-reply outside business hours with expected response time',
    trigger: 'business_hours_end',
    conditions: [],
    actions: [{ type: 'send_reply', params: { message: 'Thanks for reaching out! Our team is currently offline. We\'ll respond within 2 business hours when we\'re back.' } }],
    enabled: true,
    priority: 6,
    executionCount: 0,
    lastExecutedAt: null,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
defaultRules.forEach(r => rules.set(r.id, r));

export class AutomationService {
  async getRules(): Promise<AutomationRule[]> {
    return Array.from(rules.values()).sort((a, b) => a.priority - b.priority);
  }

  async getRule(id: string): Promise<AutomationRule | null> {
    return rules.get(id) || null;
  }

  async createRule(data: Omit<AutomationRule, 'id' | 'executionCount' | 'lastExecutedAt' | 'createdAt' | 'updatedAt'>): Promise<AutomationRule> {
    const rule: AutomationRule = {
      id: randomUUID(),
      ...data,
      executionCount: 0,
      lastExecutedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rules.set(rule.id, rule);
    return rule;
  }

  async updateRule(id: string, data: Partial<AutomationRule>): Promise<AutomationRule | null> {
    const rule = rules.get(id);
    if (!rule) return null;
    Object.assign(rule, data, { updatedAt: new Date().toISOString() });
    rules.set(id, rule);
    return rule;
  }

  async deleteRule(id: string): Promise<boolean> {
    return rules.delete(id);
  }

  async toggleRule(id: string): Promise<AutomationRule | null> {
    const rule = rules.get(id);
    if (!rule) return null;
    rule.enabled = !rule.enabled;
    rule.updatedAt = new Date().toISOString();
    rules.set(id, rule);
    return rule;
  }

  async executeRule(ruleId: string, context: { ticketId?: string }): Promise<AutomationLog> {
    const rule = rules.get(ruleId);
    const log: AutomationLog = {
      id: randomUUID(),
      ruleId,
      ruleName: rule?.name || 'Unknown',
      trigger: rule?.trigger || 'ticket_created',
      ticketId: context.ticketId || null,
      actionsExecuted: rule?.actions.map(a => a.type) || [],
      success: true,
      error: null,
      executedAt: new Date().toISOString(),
    };

    if (rule) {
      rule.executionCount++;
      rule.lastExecutedAt = log.executedAt;
      rules.set(ruleId, rule);
    }

    logs.push(log);
    return log;
  }

  async getLogs(limit?: number): Promise<AutomationLog[]> {
    return logs.slice(-(limit || 100)).reverse();
  }

  async getStats(): Promise<{ totalRules: number; activeRules: number; totalExecutions: number; successRate: number }> {
    const allRules = Array.from(rules.values());
    const totalExecutions = logs.length;
    const successfulExecutions = logs.filter(l => l.success).length;

    return {
      totalRules: allRules.length,
      activeRules: allRules.filter(r => r.enabled).length,
      totalExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100,
    };
  }
}

export const automationService = new AutomationService();
