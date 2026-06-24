import type { RequestHandler } from "express";

const NO_STORE_CACHE_CONTROL = "no-store, no-cache, must-revalidate, proxy-revalidate, private, max-age=0";

export const noStore: RequestHandler = (_req, res, next) => {
  res.setHeader("Cache-Control", NO_STORE_CACHE_CONTROL);
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.vary("Authorization");
  res.vary("Cookie");
  next();
};
