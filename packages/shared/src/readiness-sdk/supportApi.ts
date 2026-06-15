import type { RemoteDeskApiClient } from "./RemoteDeskApiClient.js";

export interface CreateSupportTicketInput {
  subject: string;
  body: string;
  priority: "low" | "normal" | "high" | "urgent";
}

export function createSupportApi(client: RemoteDeskApiClient) {
  return {
    listTickets: () => client.get<{ data: unknown[] }>("/support/tickets"),
    createTicket: (input: CreateSupportTicketInput) => client.post<{ data: unknown }>("/support/tickets", input)
  };
}
