import { HTTPClient } from './httpClient.js';
import type { PaginationParams } from '@remotedesk/shared';

export interface SessionRecord {
  id: string;
  hostDeviceId: string;
  clientDeviceId: string;
  startedAt: number;
  endedAt?: number;
  durationSeconds: number;
  disconnectReason?: string;
}

export class SessionClient {
  constructor(private http: HTTPClient) {}

  list(_params?: PaginationParams) { return this.http.get<SessionRecord[]>('/sessions/history'); }
  get(id: string) { return this.http.get<SessionRecord>(`/sessions/${id}`); }
  end(id: string) { return this.http.post<void>(`/sessions/${id}/end`, {}); }
}


