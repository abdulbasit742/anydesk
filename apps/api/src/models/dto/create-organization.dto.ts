export interface CreateOrganizationDto { name: string; domain?: string; industry?: string; size?: "1-10" | "11-50" | "51-200" | "201-500" | "500+"; }
export interface InviteMemberDto { email: string; role: "admin" | "manager" | "technician" | "viewer"; }
export interface UpdateMemberRoleDto { role: "admin" | "manager" | "technician" | "viewer"; }
