import type { Request, Response, NextFunction } from "express";

export function requireSessionCollaborationAccess(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string; permissions?: string[] } | undefined;
  if (user?.role === "owner" || user?.role === "admin" || user?.role === "support" || user?.permissions?.includes("session:collaborate")) {
    next();
    return;
  }
  res.status(403).json({ error: "session_collaboration_access_required" });
}
