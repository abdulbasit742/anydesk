export type DataSubjectRequestType = "export" | "delete" | "rectify";

export interface DataSubjectRequest {
  id: string;
  subjectUserId: string;
  type: DataSubjectRequestType;
  status: "queued" | "processing" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  rejectionReason?: string;
}

export function canStartDataSubjectRequest(request: DataSubjectRequest): boolean {
  return request.status === "queued";
}

export function completeDataSubjectRequest(request: DataSubjectRequest, completedAt = new Date().toISOString()): DataSubjectRequest {
  if (request.status !== "processing") throw new Error("request-not-processing");
  return { ...request, status: "completed", completedAt };
}
