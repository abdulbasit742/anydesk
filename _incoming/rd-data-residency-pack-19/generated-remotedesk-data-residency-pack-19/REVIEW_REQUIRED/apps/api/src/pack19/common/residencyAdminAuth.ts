import type { Request, Response, NextFunction } from "express";

export function requireResidencyAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("residency:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "residency_admin_required" });
}
