import { Request, Response, NextFunction } from "express";
export const throttle = (delayMs: number = 100) => (req: Request, res: Response, next: NextFunction) => {
  setTimeout(next, delayMs);
};
