import { Request, Response, NextFunction } from "express";
export const corsMiddleware = (allowedOrigins: string[] = ["*"]) => (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) { res.set("Access-Control-Allow-Origin", origin || "*"); }
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
};
