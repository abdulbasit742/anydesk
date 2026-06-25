/**
 * VoIP Phone System Service
 * Full business phone system with IVR, queues, recording, and routing
 */

import { randomUUID } from 'node:crypto';

export type CallStatus = 'ringing' | 'in_progress' | 'on_hold' | 'completed' | 'missed' | 'voicemail';
export type CallDirection = 'inbound' | 'outbound';

export interface VirtualNumber {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  type: 'local' | 'toll_free' | 'mobile';
  assignedTo: string | null;
  enabled: boolean;
  createdAt: string;
}

export interface IVRMenu {
  id: string;
  name: string;
  greeting: string;
  options: IVROption[];
  timeoutAction: 'repeat' | 'voicemail' | 'transfer';
  businessHoursOnly: boolean;
  createdAt: string;
}

export interface IVROption {
  digit: string;
  label: string;
  action: 'transfer_queue' | 'transfer_agent' | 'voicemail' | 'submenu' | 'play_message';
  targetId: string;
}

export interface CallQueue {
  id: string;
  name: string;
  strategy: 'round_robin' | 'longest_idle' | 'least_calls' | 'ring_all';
  maxWaitTime: number;
  holdMusicUrl: string | null;
  agents: string[];
  createdAt: string;
}

export interface Call {
  id: string;
  direction: CallDirection;
  status: CallStatus;
  from: string;
  to: string;
  agentId: string | null;
  queueId: string | null;
  duration: number;
  recordingUrl: string | null;
  transcription: string | null;
  voicemailUrl: string | null;
  ticketId: string | null;
  metadata: Record<string, unknown>;
  startedAt: string;
  answeredAt: string | null;
  endedAt: string | null;
}

export interface BusinessHours {
  id: string;
  name: string;
  timezone: string;
  schedule: { day: number; start: string; end: string }[];
  holidays: string[];
}

const virtualNumbers = new Map<string, VirtualNumber>();
const ivrMenus = new Map<string, IVRMenu>();
const callQueues = new Map<string, CallQueue>();
const calls = new Map<string, Call>();
const businessHours = new Map<string, BusinessHours>();

// Initialize sample data
const sampleNumbers: VirtualNumber[] = [
  { id: 'vn-1', number: '+1-555-0100', country: 'United States', countryCode: 'US', type: 'local', assignedTo: null, enabled: true, createdAt: new Date().toISOString() },
  { id: 'vn-2', number: '+44-20-7946-0958', country: 'United Kingdom', countryCode: 'GB', type: 'local', assignedTo: null, enabled: true, createdAt: new Date().toISOString() },
  { id: 'vn-3', number: '+49-30-123456', country: 'Germany', countryCode: 'DE', type: 'local', assignedTo: null, enabled: true, createdAt: new Date().toISOString() },
];
sampleNumbers.forEach(n => virtualNumbers.set(n.id, n));

const defaultQueue: CallQueue = {
  id: 'queue-support',
  name: 'Support Queue',
  strategy: 'round_robin',
  maxWaitTime: 300,
  holdMusicUrl: null,
  agents: [],
  createdAt: new Date().toISOString(),
};
callQueues.set(defaultQueue.id, defaultQueue);

const defaultIVR: IVRMenu = {
  id: 'ivr-main',
  name: 'Main Menu',
  greeting: 'Thank you for calling RemoteDesk. Press 1 for sales, 2 for support, 3 for billing.',
  options: [
    { digit: '1', label: 'Sales', action: 'transfer_queue', targetId: 'queue-sales' },
    { digit: '2', label: 'Support', action: 'transfer_queue', targetId: 'queue-support' },
    { digit: '3', label: 'Billing', action: 'transfer_queue', targetId: 'queue-billing' },
  ],
  timeoutAction: 'repeat',
  businessHoursOnly: true,
  createdAt: new Date().toISOString(),
};
ivrMenus.set(defaultIVR.id, defaultIVR);

export class VoIPService {
  // Virtual Numbers
  async getNumbers(): Promise<VirtualNumber[]> {
    return Array.from(virtualNumbers.values());
  }

  async provisionNumber(country: string, type: 'local' | 'toll_free' | 'mobile'): Promise<VirtualNumber> {
    const number: VirtualNumber = {
      id: randomUUID(),
      number: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      country,
      countryCode: country.substring(0, 2).toUpperCase(),
      type,
      assignedTo: null,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    virtualNumbers.set(number.id, number);
    return number;
  }

  // IVR
  async getIVRMenus(): Promise<IVRMenu[]> {
    return Array.from(ivrMenus.values());
  }

  async createIVRMenu(data: Omit<IVRMenu, 'id' | 'createdAt'>): Promise<IVRMenu> {
    const menu: IVRMenu = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    ivrMenus.set(menu.id, menu);
    return menu;
  }

  async updateIVRMenu(id: string, data: Partial<IVRMenu>): Promise<IVRMenu | null> {
    const menu = ivrMenus.get(id);
    if (!menu) return null;
    Object.assign(menu, data);
    ivrMenus.set(id, menu);
    return menu;
  }

  // Call Queues
  async getQueues(): Promise<CallQueue[]> {
    return Array.from(callQueues.values());
  }

  async createQueue(data: Omit<CallQueue, 'id' | 'createdAt'>): Promise<CallQueue> {
    const queue: CallQueue = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    callQueues.set(queue.id, queue);
    return queue;
  }

  async updateQueue(id: string, data: Partial<CallQueue>): Promise<CallQueue | null> {
    const queue = callQueues.get(id);
    if (!queue) return null;
    Object.assign(queue, data);
    callQueues.set(id, queue);
    return queue;
  }

  // Calls
  async initiateCall(from: string, to: string, agentId?: string): Promise<Call> {
    const call: Call = {
      id: randomUUID(),
      direction: 'outbound',
      status: 'ringing',
      from,
      to,
      agentId: agentId || null,
      queueId: null,
      duration: 0,
      recordingUrl: null,
      transcription: null,
      voicemailUrl: null,
      ticketId: null,
      metadata: {},
      startedAt: new Date().toISOString(),
      answeredAt: null,
      endedAt: null,
    };
    calls.set(call.id, call);
    return call;
  }

  async handleIncomingCall(from: string, to: string): Promise<Call> {
    const call: Call = {
      id: randomUUID(),
      direction: 'inbound',
      status: 'ringing',
      from,
      to,
      agentId: null,
      queueId: 'queue-support',
      duration: 0,
      recordingUrl: null,
      transcription: null,
      voicemailUrl: null,
      ticketId: null,
      metadata: {},
      startedAt: new Date().toISOString(),
      answeredAt: null,
      endedAt: null,
    };
    calls.set(call.id, call);
    return call;
  }

  async answerCall(callId: string, agentId: string): Promise<Call | null> {
    const call = calls.get(callId);
    if (!call) return null;
    call.status = 'in_progress';
    call.agentId = agentId;
    call.answeredAt = new Date().toISOString();
    calls.set(callId, call);
    return call;
  }

  async holdCall(callId: string): Promise<Call | null> {
    const call = calls.get(callId);
    if (!call) return null;
    call.status = 'on_hold';
    calls.set(callId, call);
    return call;
  }

  async transferCall(callId: string, targetAgentId: string): Promise<Call | null> {
    const call = calls.get(callId);
    if (!call) return null;
    call.agentId = targetAgentId;
    call.status = 'in_progress';
    calls.set(callId, call);
    return call;
  }

  async endCall(callId: string): Promise<Call | null> {
    const call = calls.get(callId);
    if (!call) return null;
    call.status = 'completed';
    call.endedAt = new Date().toISOString();
    if (call.answeredAt) {
      call.duration = Math.floor((new Date(call.endedAt).getTime() - new Date(call.answeredAt).getTime()) / 1000);
    }
    call.recordingUrl = `/recordings/${call.id}.mp3`;
    calls.set(callId, call);
    return call;
  }

  async getCalls(filter?: { status?: CallStatus; agentId?: string; direction?: CallDirection }): Promise<Call[]> {
    let results = Array.from(calls.values());
    if (filter?.status) results = results.filter(c => c.status === filter.status);
    if (filter?.agentId) results = results.filter(c => c.agentId === filter.agentId);
    if (filter?.direction) results = results.filter(c => c.direction === filter.direction);
    return results.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }

  async getCall(id: string): Promise<Call | null> {
    return calls.get(id) || null;
  }

  // Business Hours
  async getBusinessHours(): Promise<BusinessHours[]> {
    return Array.from(businessHours.values());
  }

  async setBusinessHours(data: Omit<BusinessHours, 'id'>): Promise<BusinessHours> {
    const bh: BusinessHours = { id: randomUUID(), ...data };
    businessHours.set(bh.id, bh);
    return bh;
  }
}

export const voipService = new VoIPService();
