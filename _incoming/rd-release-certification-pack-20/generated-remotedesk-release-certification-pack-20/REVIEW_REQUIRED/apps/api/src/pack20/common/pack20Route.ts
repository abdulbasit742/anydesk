import type { Request, Response, NextFunction } from 'express';
export function pack20Route(handler: (req: Request, res: Response, next: NextFunction)=>Promise<void>) { return (req: Request, res: Response, next: NextFunction): void => { handler(req,res,next).catch(next); }; }
