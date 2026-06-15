import type { Request, Response, NextFunction } from "express";

export function requireEnterpriseAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("enterprise:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "enterprise_admin_required" });
}
