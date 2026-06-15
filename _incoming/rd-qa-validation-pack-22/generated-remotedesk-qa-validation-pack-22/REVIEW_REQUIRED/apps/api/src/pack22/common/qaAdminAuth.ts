import type { Request, Response, NextFunction } from "express";

export function requireQaAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("qa:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "qa_admin_required" });
}
