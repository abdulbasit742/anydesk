/**
 * Ticket Management Service
 * Handles CRUD, SLA tracking, assignment, merging, and satisfaction surveys
 */

import { randomUUID } from 'node:crypto';
import type {
  Ticket, TicketReply, TicketFilter, CreateTicketDto,
  UpdateTicketDto, TicketReplyDto, MergeTicketsDto,
  TicketStatus, TicketPriority, AssignmentStrategy, SLAPolicy
} from './ticket.types.js';

// In-memory store (production would use PostgreSQL via Prisma)
const tickets = new Map<string, Ticket>();
const ticketReplies = new Map<string, TicketReply[]>();
let ticketCounter = 1000;

const slaPolicies: SLAPolicy[] = [
  { id: 'sla-critical', name: 'Critical SLA', priority: 'critical', firstResponseTimeMinutes: 15, resolutionTimeMinutes: 240, businessHoursOnly: false, escalationRules: [] },
  { id: 'sla-high', name: 'High SLA', priority: 'high', firstResponseTimeMinutes: 60, resolutionTimeMinutes: 480, businessHoursOnly: true, escalationRules: [] },
  { id: 'sla-medium', name: 'Medium SLA', priority: 'medium', firstResponseTimeMinutes: 240, resolutionTimeMinutes: 1440, businessHoursOnly: true, escalationRules: [] },
  { id: 'sla-low', name: 'Low SLA', priority: 'low', firstResponseTimeMinutes: 480, resolutionTimeMinutes: 2880, businessHoursOnly: true, escalationRules: [] },
];

function getSLABreachTime(priority: TicketPriority): string {
  const policy = slaPolicies.find(p => p.priority === priority);
  if (!policy) return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return new Date(Date.now() + policy.resolutionTimeMinutes * 60 * 1000).toISOString();
}

export class TicketService {
  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const id = randomUUID();
    const now = new Date().toISOString();
    ticketCounter++;

    const ticket: Ticket = {
      id,
      number: ticketCounter,
      subject: dto.subject,
      description: dto.description,
      status: 'open',
      priority: dto.priority || 'medium',
      channel: dto.channel || 'web_form',
      assigneeId: dto.assigneeId || null,
      requesterId: dto.requesterId || 'anonymous',
      teamId: dto.teamId || null,
      parentTicketId: dto.parentTicketId || null,
      tags: dto.tags || [],
      category: dto.category || null,
      customFields: dto.customFields || {},
      slaBreachAt: getSLABreachTime(dto.priority || 'medium'),
      firstResponseAt: null,
      resolvedAt: null,
      closedAt: null,
      satisfactionRating: null,
      satisfactionComment: null,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    };

    tickets.set(id, ticket);
    ticketReplies.set(id, []);
    return ticket;
  }

  async getTicket(id: string): Promise<Ticket | null> {
    return tickets.get(id) || null;
  }

  async listTickets(filter: TicketFilter): Promise<{ tickets: Ticket[]; total: number; page: number; limit: number }> {
    let results = Array.from(tickets.values());

    if (filter.status?.length) results = results.filter(t => filter.status!.includes(t.status));
    if (filter.priority?.length) results = results.filter(t => filter.priority!.includes(t.priority));
    if (filter.channel?.length) results = results.filter(t => filter.channel!.includes(t.channel));
    if (filter.assigneeId) results = results.filter(t => t.assigneeId === filter.assigneeId);
    if (filter.teamId) results = results.filter(t => t.teamId === filter.teamId);
    if (filter.tags?.length) results = results.filter(t => filter.tags!.some(tag => t.tags.includes(tag)));
    if (filter.category) results = results.filter(t => t.category === filter.category);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(t => t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (filter.dateFrom) results = results.filter(t => t.createdAt >= filter.dateFrom!);
    if (filter.dateTo) results = results.filter(t => t.createdAt <= filter.dateTo!);

    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';
    results.sort((a, b) => {
      const aVal = (a as any)[sortBy] || '';
      const bVal = (b as any)[sortBy] || '';
      return sortOrder === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

    const total = results.length;
    const page = filter.page || 1;
    const limit = filter.limit || 25;
    const offset = (page - 1) * limit;
    results = results.slice(offset, offset + limit);

    return { tickets: results, total, page, limit };
  }

  async updateTicket(id: string, dto: UpdateTicketDto): Promise<Ticket | null> {
    const ticket = tickets.get(id);
    if (!ticket) return null;

    const now = new Date().toISOString();
    if (dto.subject !== undefined) ticket.subject = dto.subject;
    if (dto.description !== undefined) ticket.description = dto.description;
    if (dto.status !== undefined) {
      ticket.status = dto.status;
      if (dto.status === 'resolved') ticket.resolvedAt = now;
      if (dto.status === 'closed') ticket.closedAt = now;
    }
    if (dto.priority !== undefined) ticket.priority = dto.priority;
    if (dto.assigneeId !== undefined) ticket.assigneeId = dto.assigneeId;
    if (dto.teamId !== undefined) ticket.teamId = dto.teamId;
    if (dto.tags !== undefined) ticket.tags = dto.tags;
    if (dto.category !== undefined) ticket.category = dto.category;
    if (dto.customFields !== undefined) ticket.customFields = { ...ticket.customFields, ...dto.customFields };
    ticket.updatedAt = now;

    tickets.set(id, ticket);
    return ticket;
  }

  async replyToTicket(ticketId: string, authorId: string, dto: TicketReplyDto): Promise<TicketReply | null> {
    const ticket = tickets.get(ticketId);
    if (!ticket) return null;

    const reply: TicketReply = {
      id: randomUUID(),
      ticketId,
      authorId,
      body: dto.body,
      isInternal: dto.isInternal || false,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const replies = ticketReplies.get(ticketId) || [];
    replies.push(reply);
    ticketReplies.set(ticketId, replies);

    // Track first response
    if (!ticket.firstResponseAt && !dto.isInternal) {
      ticket.firstResponseAt = reply.createdAt;
      ticket.updatedAt = reply.createdAt;
      tickets.set(ticketId, ticket);
    }

    return reply;
  }

  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    return ticketReplies.get(ticketId) || [];
  }

  async mergeTickets(dto: MergeTicketsDto): Promise<Ticket | null> {
    const target = tickets.get(dto.targetTicketId);
    if (!target) return null;

    for (const sourceId of dto.sourceTicketIds) {
      const source = tickets.get(sourceId);
      if (source) {
        source.status = 'closed';
        source.closedAt = new Date().toISOString();
        source.metadata = { ...source.metadata, mergedInto: dto.targetTicketId };
        tickets.set(sourceId, source);

        // Move replies to target
        const sourceReplies = ticketReplies.get(sourceId) || [];
        const targetReplies = ticketReplies.get(dto.targetTicketId) || [];
        targetReplies.push(...sourceReplies.map(r => ({ ...r, ticketId: dto.targetTicketId })));
        ticketReplies.set(dto.targetTicketId, targetReplies);
      }
    }

    target.updatedAt = new Date().toISOString();
    tickets.set(dto.targetTicketId, target);
    return target;
  }

  async submitSatisfaction(ticketId: string, rating: number, comment?: string): Promise<Ticket | null> {
    const ticket = tickets.get(ticketId);
    if (!ticket) return null;
    ticket.satisfactionRating = rating;
    ticket.satisfactionComment = comment || null;
    ticket.updatedAt = new Date().toISOString();
    tickets.set(ticketId, ticket);
    return ticket;
  }

  async assignTicket(ticketId: string, strategy: AssignmentStrategy, teamId?: string): Promise<Ticket | null> {
    const ticket = tickets.get(ticketId);
    if (!ticket) return null;
    // Simulated assignment logic
    ticket.assigneeId = `agent-${Math.floor(Math.random() * 100)}`;
    ticket.updatedAt = new Date().toISOString();
    tickets.set(ticketId, ticket);
    return ticket;
  }

  async getStats(): Promise<Record<string, number>> {
    const all = Array.from(tickets.values());
    return {
      total: all.length,
      open: all.filter(t => t.status === 'open').length,
      pending: all.filter(t => t.status === 'pending').length,
      inProgress: all.filter(t => t.status === 'in_progress').length,
      resolved: all.filter(t => t.status === 'resolved').length,
      closed: all.filter(t => t.status === 'closed').length,
      critical: all.filter(t => t.priority === 'critical').length,
      high: all.filter(t => t.priority === 'high').length,
      medium: all.filter(t => t.priority === 'medium').length,
      low: all.filter(t => t.priority === 'low').length,
    };
  }
}

export const ticketService = new TicketService();
