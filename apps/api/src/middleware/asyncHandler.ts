import type { NextFunction, Request, RequestHandler, Response } from "express";

export type AsyncRequestHandler<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export function asyncHandler<TReq extends Request = Request>(handler: AsyncRequestHandler<TReq>): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(handler(req as TReq, res, next)).catch(next);
  };
}
