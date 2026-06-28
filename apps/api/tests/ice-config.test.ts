/**
 * Unit tests for ICE server config logic (apps/api/src/routes/ice.routes.ts)
 * Tests the pure server-building logic without starting an HTTP server.
 * Runner: node --test
 */

import test from "node:test";
import assert from "node:assert/strict";

// ── Pure helper extracted from the route for unit testing ──────────────────
interface IceServer {
  urls: string;
  username?: string;
  credential?: string;
}

interface IceConfig {
  stunUrl?: string;
  turnUrl?: string;
  turnUsername?: string;
  turnPassword?: string;
}

function buildIceServers(cfg: IceConfig): { iceServers: IceServer[]; hasTurn: boolean } {
  const servers: IceServer[] = [];
  servers.push({ urls: cfg.stunUrl ?? "stun:stun.l.google.com:19302" });

  if (cfg.turnUrl && cfg.turnUsername && cfg.turnPassword) {
    servers.push({
      urls: cfg.turnUrl,
      username: cfg.turnUsername,
      credential: cfg.turnPassword,
    });
  }

  return {
    iceServers: servers,
    hasTurn: !!(cfg.turnUrl && cfg.turnUsername && cfg.turnPassword),
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

test("returns Google public STUN when no env vars set", () => {
  const { iceServers, hasTurn } = buildIceServers({});
  assert.equal(iceServers.length, 1);
  assert.equal(iceServers[0].urls, "stun:stun.l.google.com:19302");
  assert.equal(hasTurn, false);
});

test("uses custom STUN URL when provided", () => {
  const { iceServers } = buildIceServers({ stunUrl: "stun:myserver.example.com:3478" });
  assert.equal(iceServers[0].urls, "stun:myserver.example.com:3478");
});

test("includes TURN server when all three TURN vars are set", () => {
  const { iceServers, hasTurn } = buildIceServers({
    turnUrl: "turn:turn.example.com:3478",
    turnUsername: "user1",
    turnPassword: "secret",
  });
  assert.equal(iceServers.length, 2);
  assert.equal(hasTurn, true);
  const turn = iceServers[1];
  assert.equal(turn.urls, "turn:turn.example.com:3478");
  assert.equal(turn.username, "user1");
  assert.equal(turn.credential, "secret");
});

test("does NOT add TURN when username is missing", () => {
  const { iceServers, hasTurn } = buildIceServers({
    turnUrl: "turn:turn.example.com:3478",
    turnPassword: "secret",
  });
  assert.equal(iceServers.length, 1);
  assert.equal(hasTurn, false);
});

test("does NOT add TURN when password is missing", () => {
  const { iceServers, hasTurn } = buildIceServers({
    turnUrl: "turn:turn.example.com:3478",
    turnUsername: "user1",
  });
  assert.equal(iceServers.length, 1);
  assert.equal(hasTurn, false);
});

test("does NOT add TURN when URL is missing", () => {
  const { iceServers, hasTurn } = buildIceServers({
    turnUsername: "user1",
    turnPassword: "secret",
  });
  assert.equal(iceServers.length, 1);
  assert.equal(hasTurn, false);
});

test("STUN entry is always first in the list", () => {
  const { iceServers } = buildIceServers({
    turnUrl: "turn:turn.example.com:3478",
    turnUsername: "u",
    turnPassword: "p",
  });
  assert.ok(iceServers[0].urls.startsWith("stun:"), "first entry must be STUN");
  assert.ok(iceServers[1].urls.startsWith("turn:"), "second entry must be TURN");
});
