/**
 * Unified Communications - Ticket Management System Types
 */

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
export type TicketChannel = 'email' | 'chat' | 'phone' | 'whatsapp' | 'telegram' | 'sms' | 'facebook' | 'instagram' | 'twitter' | 'web_form' | 'api';
export type AssignmentStrategy = 'round_robin' | 'skill_based' | 'load_based' | 'manual';

export interface Ticket {
  id: string;
  number: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  assigneeId: string | null;
  requesterId: string;
  teamId: string | null;
  parentTicketId: string | null;
  tags: string[];
  category: string | null;
  customFields: Record<string, unknown>;
  slaBreachAt: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  satisfactionRating: number | null;
  satisfactionComment: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface SLAPolicy {
  id: string;
  name: string;
  priority: TicketPriority;
  firstResponseTimeMinutes: number;
  resolutionTimeMinutes: number;
  businessHoursOnly: boolean;
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  condition: string;
  action: 'notify' | 'reassign' | 'escalate';
  targetId: string;
  delayMinutes: number;
}

export interface TicketFilter {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  channel?: TicketChannel[];
  assigneeId?: string;
  teamId?: string;
  tags?: string[];
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTicketDto {
  subject: string;
  description: string;
  priority?: TicketPriority;
  channel?: TicketChannel;
  requesterId?: string;
  assigneeId?: string;
  teamId?: string;
  tags?: string[];
  category?: string;
  customFields?: Record<string, unknown>;
  parentTicketId?: string;
}

export interface UpdateTicketDto {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string | null;
  teamId?: string | null;
  tags?: string[];
  category?: string | null;
  customFields?: Record<string, unknown>;
}

export interface TicketReplyDto {
  body: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface MergeTicketsDto {
  sourceTicketIds: string[];
  targetTicketId: string;
}
