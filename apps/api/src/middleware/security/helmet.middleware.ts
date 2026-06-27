import { Request, Response, NextFunction } from "express";
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("X-XSS-Protection", "1; mode=block");
  res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.set("Content-Security-Policy", "default-src 'self'");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};
