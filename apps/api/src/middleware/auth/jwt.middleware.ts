import { Request, Response, NextFunction } from "express";
export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });
  try { /* verify JWT */ next(); } catch { res.status(401).json({ error: "Invalid token" }); }
};
