export interface CustomerHealthInput {
  activeDevices: number;
  successfulSessions7d: number;
  failedSessions7d: number;
  openCriticalTickets: number;
  billingPastDue: boolean;
}

export type CustomerHealthBand = "healthy" | "watch" | "at_risk" | "critical";

export function scoreCustomerHealth(input: CustomerHealthInput): CustomerHealthBand {
  if (input.billingPastDue || input.openCriticalTickets > 0) return "critical";
  const total = input.successfulSessions7d + input.failedSessions7d;
  const failureRate = total === 0 ? 0 : input.failedSessions7d / total;
  if (input.activeDevices === 0 || failureRate >= 0.4) return "at_risk";
  if (failureRate >= 0.15) return "watch";
  return "healthy";
}
