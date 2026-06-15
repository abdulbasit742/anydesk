export type ComponentStatus = "operational" | "degraded_performance" | "partial_outage" | "major_outage" | "maintenance";

export interface StatusPageComponent {
  id: string;
  name: string;
  status: ComponentStatus;
  updatedAt: string;
}

export interface StatusPageIncident {
  id: string;
  title: string;
  severity: "sev1" | "sev2" | "sev3" | "sev4";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  createdAt: string;
  updatedAt: string;
}
