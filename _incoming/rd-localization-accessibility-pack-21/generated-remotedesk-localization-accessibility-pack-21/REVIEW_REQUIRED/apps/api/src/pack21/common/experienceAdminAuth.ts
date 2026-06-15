import type { Request, Response, NextFunction } from "express";

export function requireExperienceAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.permissions?.includes("experience:manage")) {
    next();
    return;
  }
  res.status(403).json({ error: "experience_admin_required" });
}
