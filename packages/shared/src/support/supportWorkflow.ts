import type { SupportTicket, SupportTicketPriority, SupportTicketStatus } from './supportTicketTypes.js';

const ALLOWED_STATUS_TRANSITIONS: Record<SupportTicketStatus, readonly SupportTicketStatus[]> = {
  open: ['pending', 'resolved', 'closed'],
  pending: ['open', 'resolved', 'closed'],
  resolved: ['open', 'closed'],
  closed: ['open'],
};

export function canTransitionTicketStatus(from: SupportTicketStatus, to: SupportTicketStatus): boolean {
  return from === to || ALLOWED_STATUS_TRANSITIONS[from].includes(to);
}

export function transitionTicketStatus(ticket: SupportTicket, status: SupportTicketStatus, updatedAtMs: number): SupportTicket {
  if (!canTransitionTicketStatus(ticket.status, status)) {
    throw new Error(`Invalid ticket status transition: ${ticket.status} -> ${status}`);
  }
  return { ...ticket, status, updatedAtMs };
}

export function normalizeTicketPriority(priority: string): SupportTicketPriority {
  return ['low', 'normal', 'high', 'urgent'].includes(priority) ? priority as SupportTicketPriority : 'normal';
}
