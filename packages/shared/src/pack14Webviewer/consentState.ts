export type ConsentState = "pending" | "accepted" | "rejected" | "expired";

export function isConsentFinal(state: ConsentState): boolean {
  return state === "accepted" || state === "rejected" || state === "expired";
}
