import { Request, Response, NextFunction } from "express";
export const validateBody = (schema: Record<string, { type: string; required?: boolean }>) => (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  for (const [field, rules] of Object.entries(schema)) {
    if (rules.required && !req.body[field]) errors.push(`${field} is required`);
    if (req.body[field] && typeof req.body[field] !== rules.type) errors.push(`${field} must be ${rules.type}`);
  }
  if (errors.length > 0) return res.status(400).json({ errors });
  next();
};
