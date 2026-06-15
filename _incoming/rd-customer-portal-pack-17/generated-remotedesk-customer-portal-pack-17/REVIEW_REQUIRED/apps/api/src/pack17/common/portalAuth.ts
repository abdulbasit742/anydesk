import type { Request, Response, NextFunction } from "express";

export function requirePortalAccess(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.role === "billing" || user?.permissions?.includes("portal:read")) {
    next();
    return;
  }
  res.status(403).json({ error: "portal_access_required" });
}
