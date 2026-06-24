import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
  userId: string;
  email: string;
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

function assertTokenPayload(value: unknown): asserts value is TokenPayload {
  if (!value || typeof value !== "object") throw new Error("Invalid token payload");
  const payload = value as Partial<TokenPayload>;
  if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
    throw new Error("Invalid token payload");
  }
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, env.jwtSecret);
  assertTokenPayload(payload);
  return payload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, env.jwtRefreshSecret);
  assertTokenPayload(payload);
  return payload;
}

export function issueTokenPair(payload: TokenPayload) {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    tokenType: "Bearer",
    expiresInSeconds: 15 * 60
  };
}
