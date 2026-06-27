import { Request, Response, NextFunction } from "express";
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) return res.status(401).json({ error: "API key required" });
  if (!apiKey.startsWith("rdk_")) return res.status(401).json({ error: "Invalid API key format" });
  next();
};
