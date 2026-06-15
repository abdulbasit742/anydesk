export type EscalationTarget = "tier2" | "engineering" | "security" | "billing";
export interface EscalationInput { priority: "low" | "normal" | "high" | "urgent"; category: "connection" | "billing" | "security" | "desktop_crash" | "data_loss" | "other"; }
export function chooseEscalationTarget(input: EscalationInput): EscalationTarget { if (input.category === "security" || input.category === "data_loss") return "security"; if (input.category === "billing") return "billing"; if (input.category === "desktop_crash" || input.priority === "urgent") return "engineering"; return "tier2"; }
