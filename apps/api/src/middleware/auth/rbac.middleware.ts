import { Request, Response, NextFunction } from "express";
export const requirePermission = (permission: string) => (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user?.role || "viewer";
  const rolePermissions: Record<string, string[]> = { admin: ["*"], manager: ["read", "write"], viewer: ["read"] };
  const perms = rolePermissions[userRole] || [];
  if (perms.includes("*") || perms.includes(permission)) return next();
  res.status(403).json({ error: "Insufficient permissions" });
};
