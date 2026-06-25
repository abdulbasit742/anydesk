/**
 * Agent Workspace Service
 * Agent management, status, canned responses, macros, and workspace features
 */

import { randomUUID } from 'node:crypto';

export type AgentStatus = 'available' | 'busy' | 'break' | 'offline';
export type AgentRole = 'agent' | 'senior_agent' | 'supervisor' | 'admin';

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: AgentStatus;
  role: AgentRole;
  teams: string[];
  skills: string[];
  maxConcurrentChats: number;
  activeChats: number;
  activeTickets: number;
  lastActiveAt: string;
  shiftStart: string | null;
  shiftEnd: string | null;
  createdAt: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  shortcut: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  createdBy: string;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  actions: MacroAction[];
  createdBy: string;
  isGlobal: boolean;
  usageCount: number;
  createdAt: string;
}

export interface MacroAction {
  type: 'reply' | 'close' | 'tag' | 'assign' | 'change_status' | 'change_priority' | 'add_note';
  params: Record<string, unknown>;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  leadId: string | null;
  escalationLevel: number;
  createdAt: string;
}

export interface ShiftSchedule {
  id: string;
  agentId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

const agents = new Map<string, Agent>();
const cannedResponses = new Map<string, CannedResponse>();
const macros = new Map<string, Macro>();
const teams = new Map<string, Team>();
const schedules: ShiftSchedule[] = [];

// Default agents
const defaultAgents: Agent[] = [
  { id: 'agent-1', name: 'Sarah Johnson', email: 'sarah@remotedesk.io', avatar: null, status: 'available', role: 'senior_agent', teams: ['team-support'], skills: ['remote-desktop', 'networking', 'windows'], maxConcurrentChats: 5, activeChats: 2, activeTickets: 8, lastActiveAt: new Date().toISOString(), shiftStart: '09:00', shiftEnd: '17:00', createdAt: new Date().toISOString() },
  { id: 'agent-2', name: 'Mike Chen', email: 'mike@remotedesk.io', avatar: null, status: 'available', role: 'agent', teams: ['team-support'], skills: ['linux', 'mac', 'networking'], maxConcurrentChats: 4, activeChats: 1, activeTickets: 6, lastActiveAt: new Date().toISOString(), shiftStart: '09:00', shiftEnd: '17:00', createdAt: new Date().toISOString() },
  { id: 'agent-3', name: 'Emily Davis', email: 'emily@remotedesk.io', avatar: null, status: 'busy', role: 'agent', teams: ['team-support', 'team-billing'], skills: ['billing', 'account-management'], maxConcurrentChats: 4, activeChats: 4, activeTickets: 12, lastActiveAt: new Date().toISOString(), shiftStart: '10:00', shiftEnd: '18:00', createdAt: new Date().toISOString() },
  { id: 'agent-4', name: 'Alex Kumar', email: 'alex@remotedesk.io', avatar: null, status: 'available', role: 'supervisor', teams: ['team-support', 'team-escalation'], skills: ['all'], maxConcurrentChats: 3, activeChats: 0, activeTickets: 5, lastActiveAt: new Date().toISOString(), shiftStart: '08:00', shiftEnd: '16:00', createdAt: new Date().toISOString() },
  { id: 'agent-5', name: 'Lisa Park', email: 'lisa@remotedesk.io', avatar: null, status: 'break', role: 'agent', teams: ['team-sales'], skills: ['sales', 'demos', 'onboarding'], maxConcurrentChats: 3, activeChats: 0, activeTickets: 4, lastActiveAt: new Date().toISOString(), shiftStart: '09:00', shiftEnd: '17:00', createdAt: new Date().toISOString() },
];
defaultAgents.forEach(a => agents.set(a.id, a));

// Default teams
const defaultTeams: Team[] = [
  { id: 'team-support', name: 'Support', description: 'L1 Technical Support', members: ['agent-1', 'agent-2', 'agent-3'], leadId: 'agent-4', escalationLevel: 1, createdAt: new Date().toISOString() },
  { id: 'team-escalation', name: 'Escalation', description: 'L2/L3 Escalation Team', members: ['agent-4'], leadId: null, escalationLevel: 2, createdAt: new Date().toISOString() },
  { id: 'team-billing', name: 'Billing', description: 'Billing & Account Team', members: ['agent-3'], leadId: null, escalationLevel: 1, createdAt: new Date().toISOString() },
  { id: 'team-sales', name: 'Sales', description: 'Sales & Retention', members: ['agent-5'], leadId: null, escalationLevel: 1, createdAt: new Date().toISOString() },
  { id: 'team-retention', name: 'Retention', description: 'Customer Retention Team', members: ['agent-5'], leadId: null, escalationLevel: 1, createdAt: new Date().toISOString() },
];
defaultTeams.forEach(t => teams.set(t.id, t));

// Default canned responses
const defaultCanned: CannedResponse[] = [
  { id: 'canned-1', title: 'Greeting', shortcut: '/hi', content: 'Hi {{customer_name}}! Thanks for reaching out. How can I help you today?', category: 'General', tags: ['greeting'], usageCount: 0, createdBy: 'system', isGlobal: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'canned-2', title: 'Remote Session Request', shortcut: '/remote', content: 'I\'d like to take a look at your screen to better understand the issue. Would you mind if I start a remote support session? I\'ll send you a link to connect.', category: 'Remote Support', tags: ['remote', 'session'], usageCount: 0, createdBy: 'system', isGlobal: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'canned-3', title: 'Closing', shortcut: '/close', content: 'Is there anything else I can help you with? If not, I\'ll go ahead and close this ticket. You\'ll receive a brief satisfaction survey — your feedback helps us improve!', category: 'General', tags: ['closing'], usageCount: 0, createdBy: 'system', isGlobal: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'canned-4', title: 'Password Reset', shortcut: '/pwreset', content: 'I\'ve sent a password reset link to your registered email address. Please check your inbox (and spam folder) and follow the instructions. The link expires in 24 hours.', category: 'Account', tags: ['password', 'reset'], usageCount: 0, createdBy: 'system', isGlobal: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'canned-5', title: 'Escalation Notice', shortcut: '/escalate', content: 'I\'m going to escalate this to our senior technical team for further investigation. They\'ll reach out to you within the next 2 hours. Your ticket number is #{{ticket_number}}.', category: 'Escalation', tags: ['escalate'], usageCount: 0, createdBy: 'system', isGlobal: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
defaultCanned.forEach(c => cannedResponses.set(c.id, c));

// Default macros
const defaultMacros: Macro[] = [
  { id: 'macro-1', name: 'Resolve & Close', description: 'Send closing message, mark resolved, close ticket', actions: [{ type: 'reply', params: { content: 'This issue has been resolved. Closing ticket.' } }, { type: 'change_status', params: { status: 'resolved' } }, { type: 'close', params: {} }], createdBy: 'system', isGlobal: true, usageCount: 0, createdAt: new Date().toISOString() },
  { id: 'macro-2', name: 'Escalate to L2', description: 'Tag, assign to escalation team, change priority', actions: [{ type: 'tag', params: { tag: 'escalated' } }, { type: 'assign', params: { teamId: 'team-escalation' } }, { type: 'change_priority', params: { priority: 'high' } }], createdBy: 'system', isGlobal: true, usageCount: 0, createdAt: new Date().toISOString() },
];
defaultMacros.forEach(m => macros.set(m.id, m));

export class AgentService {
  // Agents
  async getAgents(): Promise<Agent[]> {
    return Array.from(agents.values());
  }

  async getAgent(id: string): Promise<Agent | null> {
    return agents.get(id) || null;
  }

  async updateAgentStatus(id: string, status: AgentStatus): Promise<Agent | null> {
    const agent = agents.get(id);
    if (!agent) return null;
    agent.status = status;
    agent.lastActiveAt = new Date().toISOString();
    agents.set(id, agent);
    return agent;
  }

  async getAgentStatus(): Promise<{ available: number; busy: number; break: number; offline: number; agents: Pick<Agent, 'id' | 'name' | 'status' | 'activeChats'>[] }> {
    const all = Array.from(agents.values());
    return {
      available: all.filter(a => a.status === 'available').length,
      busy: all.filter(a => a.status === 'busy').length,
      break: all.filter(a => a.status === 'break').length,
      offline: all.filter(a => a.status === 'offline').length,
      agents: all.map(a => ({ id: a.id, name: a.name, status: a.status, activeChats: a.activeChats })),
    };
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return Array.from(teams.values());
  }

  async createTeam(data: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
    const team: Team = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    teams.set(team.id, team);
    return team;
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team | null> {
    const team = teams.get(id);
    if (!team) return null;
    Object.assign(team, data);
    teams.set(id, team);
    return team;
  }

  // Canned Responses
  async getCannedResponses(category?: string): Promise<CannedResponse[]> {
    let results = Array.from(cannedResponses.values());
    if (category) results = results.filter(c => c.category === category);
    return results;
  }

  async createCannedResponse(data: Omit<CannedResponse, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<CannedResponse> {
    const response: CannedResponse = {
      id: randomUUID(),
      ...data,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    cannedResponses.set(response.id, response);
    return response;
  }

  async updateCannedResponse(id: string, data: Partial<CannedResponse>): Promise<CannedResponse | null> {
    const response = cannedResponses.get(id);
    if (!response) return null;
    Object.assign(response, data, { updatedAt: new Date().toISOString() });
    cannedResponses.set(id, response);
    return response;
  }

  async deleteCannedResponse(id: string): Promise<boolean> {
    return cannedResponses.delete(id);
  }

  // Macros
  async getMacros(): Promise<Macro[]> {
    return Array.from(macros.values());
  }

  async createMacro(data: Omit<Macro, 'id' | 'usageCount' | 'createdAt'>): Promise<Macro> {
    const macro: Macro = { id: randomUUID(), ...data, usageCount: 0, createdAt: new Date().toISOString() };
    macros.set(macro.id, macro);
    return macro;
  }

  async executeMacro(macroId: string, _ticketId: string): Promise<{ success: boolean; actionsExecuted: string[] }> {
    const macro = macros.get(macroId);
    if (!macro) return { success: false, actionsExecuted: [] };
    macro.usageCount++;
    macros.set(macroId, macro);
    return { success: true, actionsExecuted: macro.actions.map(a => a.type) };
  }

  // Shift Scheduling
  async getSchedules(agentId?: string): Promise<ShiftSchedule[]> {
    if (agentId) return schedules.filter(s => s.agentId === agentId);
    return schedules;
  }

  async setSchedule(data: Omit<ShiftSchedule, 'id'>): Promise<ShiftSchedule> {
    const schedule: ShiftSchedule = { id: randomUUID(), ...data };
    schedules.push(schedule);
    return schedule;
  }

  // Workload
  async getWorkloadBalance(): Promise<{ agentId: string; name: string; load: number; capacity: number }[]> {
    return Array.from(agents.values()).map(a => ({
      agentId: a.id,
      name: a.name,
      load: a.activeChats + a.activeTickets,
      capacity: a.maxConcurrentChats + 20,
    }));
  }
}

export const agentService = new AgentService();
