export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "refunded" | "past_due";

export function paymentStatusBlocksNewSubscription(status: PaymentStatus): boolean {
  return status === "failed" || status === "past_due";
}
