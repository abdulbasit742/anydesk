import type { RemoteDeskApiClient } from "./RemoteDeskApiClient.js";

export function createSessionApi(client: RemoteDeskApiClient) {
  return {
    listEvents: (sessionId: string) => client.get<{ data: unknown[] }>(`/sessions/${encodeURIComponent(sessionId)}/events`),
    endSession: (sessionId: string, reason: string) => client.post<{ data: unknown }>(`/sessions/${encodeURIComponent(sessionId)}/end`, { reason })
  };
}
