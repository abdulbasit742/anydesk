import { HTTPClient } from './httpClient.js';
import { PaginationParams, PaginatedResponse } from '@remotedesk/shared';

export interface AuditEvent {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  createdAt: number;
  ip?: string;
  userAgent?: string;
}

export class AuditClient {
  constructor(private http: HTTPClient) {}

  list(params?: PaginationParams & { resourceType?: string; actorId?: string }) {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.resourceType) q.set('resourceType', params.resourceType);
    if (params?.actorId) q.set('actorId', params.actorId);
    return this.http.get<PaginatedResponse<AuditEvent>>(`/audit?${q.toString()}`);
  }
}


