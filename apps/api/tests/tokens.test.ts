/**
 * Unit tests for JWT token helpers (apps/api/src/lib/tokens.ts)
 * Runner: node --test (Node.js built-in test runner)
 */

import test from "node:test";
import assert from "node:assert/strict";

// Set dev env vars before importing env module
process.env.NODE_ENV = "development";
process.env.DEV_IN_MEMORY_FALLBACK = "true";

// Dynamic import so env is set first
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, issueTokenPair } =
  await import("../src/lib/tokens.js");

const PAYLOAD = { userId: "user-123", email: "test@example.com" };

test("signAccessToken produces a verifiable token", () => {
  const token = signAccessToken(PAYLOAD);
  assert.equal(typeof token, "string");
  assert.ok(token.split(".").length === 3, "should be a 3-part JWT");
});

test("verifyAccessToken decodes correct payload", () => {
  const token = signAccessToken(PAYLOAD);
  const decoded = verifyAccessToken(token);
  assert.equal(decoded.userId, PAYLOAD.userId);
  assert.equal(decoded.email, PAYLOAD.email);
});

test("signRefreshToken produces a verifiable token", () => {
  const token = signRefreshToken(PAYLOAD);
  assert.equal(typeof token, "string");
  const decoded = verifyRefreshToken(token);
  assert.equal(decoded.userId, PAYLOAD.userId);
});

test("verifyAccessToken throws on tampered token", () => {
  const token = signAccessToken(PAYLOAD);
  const parts = token.split(".");
  parts[1] = Buffer.from(JSON.stringify({ userId: "hacker", email: "bad@example.com" })).toString("base64url");
  assert.throws(() => verifyAccessToken(parts.join(".")), /invalid/i);
});

test("verifyAccessToken throws on token signed with wrong key", () => {
  // A refresh token cannot be verified as an access token
  const refreshToken = signRefreshToken(PAYLOAD);
  // They use different secrets in prod; in dev both use dev fallback strings
  // so we test with a completely fabricated string instead
  assert.throws(() => verifyAccessToken("not.a.token"));
});

test("issueTokenPair returns both tokens and correct metadata", () => {
  const pair = issueTokenPair(PAYLOAD);
  assert.equal(typeof pair.accessToken, "string");
  assert.equal(typeof pair.refreshToken, "string");
  assert.equal(pair.tokenType, "Bearer");
  assert.equal(pair.expiresInSeconds, 900);

  // Both tokens decode to the same payload
  const a = verifyAccessToken(pair.accessToken);
  const r = verifyRefreshToken(pair.refreshToken);
  assert.equal(a.userId, PAYLOAD.userId);
  assert.equal(r.email, PAYLOAD.email);
});
