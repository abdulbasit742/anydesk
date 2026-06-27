import { Request, Response, NextFunction } from "express";
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({ error: err.message, ...(process.env.NODE_ENV === "development" && { stack: err.stack }) });
};
