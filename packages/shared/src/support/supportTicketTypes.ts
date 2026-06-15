export type SupportTicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export type SupportTicket = {
  readonly id: string;
  readonly organizationId: string;
  readonly requesterUserId: string;
  readonly subject: string;
  readonly status: SupportTicketStatus;
  readonly priority: SupportTicketPriority;
  readonly tags: readonly string[];
  readonly createdAtMs: number;
  readonly updatedAtMs: number;
};

export type SupportTicketComment = {
  readonly id: string;
  readonly ticketId: string;
  readonly authorUserId: string;
  readonly body: string;
  readonly internal: boolean;
  readonly createdAtMs: number;
};

export type SupportTicketAttachmentMetadata = {
  readonly id: string;
  readonly ticketId: string;
  readonly fileName: string;
  readonly sizeBytes: number;
  readonly mimeType: string;
  readonly storageKey: string;
  readonly uploadedAtMs: number;
};
