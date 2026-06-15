import { HTTPClient } from './httpClient.js';
import { PaginationParams, PaginatedResponse } from '@remotedesk/shared';

export interface Device { id: string; remoteDeskId: string; name: string; os: string; online: boolean; lastSeenAt: number; }
export interface UpdateDevicePayload { name?: string; password?: string; tags?: string[]; }

export class DeviceClient {
  constructor(private http: HTTPClient) {}

  list(params?: PaginationParams) { return this.http.get<PaginatedResponse<Device>>(`/devices?page=${params?.page ?? 1}&limit=${params?.limit ?? 20}`); }
  get(id: string) { return this.http.get<Device>(`/devices/${id}`); }
  update(id: string, payload: UpdateDevicePayload) { return this.http.patch<Device>(`/devices/${id}`, payload); }
  delete(id: string) { return this.http.delete<void>(`/devices/${id}`); }
  regenerateId(id: string) { return this.http.post<{ remoteDeskId: string }>(`/devices/${id}/regenerate`, {}); }
}


