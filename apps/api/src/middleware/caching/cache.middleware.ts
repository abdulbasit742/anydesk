import { Request, Response, NextFunction } from "express";
const responseCache = new Map<string, { data: any; expiresAt: number }>();
export const cacheResponse = (ttlSeconds: number = 60) => (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") return next();
  const key = `${req.path}?${JSON.stringify(req.query)}`;
  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return res.json(cached.data);
  const originalJson = res.json.bind(res);
  res.json = (data: any) => { responseCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 }); return originalJson(data); };
  next();
};
