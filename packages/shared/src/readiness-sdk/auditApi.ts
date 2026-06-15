import type { RemoteDeskApiClient } from "./RemoteDeskApiClient.js";

export function createAuditApi(client: RemoteDeskApiClient) {
  return {
    listLogs: (query = "") => client.get<{ data: unknown[] }>(`/audit/logs${query}`),
    exportLogs: (input: { format: "csv" | "json"; from?: string; to?: string }) => client.post<{ data: { jobId: string } }>("/audit/exports", input)
  };
}
