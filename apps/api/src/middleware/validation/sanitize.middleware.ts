import { Request, Response, NextFunction } from "express";
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (val: any): any => {
    if (typeof val === "string") return val.replace(/<[^>]*>/g, "").trim();
    if (Array.isArray(val)) return val.map(sanitizeValue);
    if (typeof val === "object" && val !== null) { const clean: any = {}; for (const [k, v] of Object.entries(val)) clean[k] = sanitizeValue(v); return clean; }
    return val;
  };
  req.body = sanitizeValue(req.body);
  next();
};
