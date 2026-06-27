import { Request, Response, NextFunction } from "express";
export const ipWhitelist = (allowedIps: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || "";
  if (allowedIps.length === 0 || allowedIps.includes(clientIp)) return next();
  res.status(403).json({ error: "IP not allowed" });
};
