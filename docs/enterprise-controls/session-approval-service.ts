export interface ApprovalRequest { id: string; sessionId: string; requesterId: string; approverIds: string[]; permissions: string[]; status: "pending" | "approved" | "rejected" | "expired"; createdAt: Date; expiresAt: Date; }
export async function createApprovalRequest(params: Omit<ApprovalRequest, "id" | "createdAt" | "status">): Promise<ApprovalRequest> {
  return { ...params, id: `apr_${Date.now()}`, status: "pending", createdAt: new Date() };
}
