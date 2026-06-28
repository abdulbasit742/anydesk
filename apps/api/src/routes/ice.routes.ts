import { Router } from "express";
import { env } from "../config/env.js";

const router = Router();

interface IceServer {
  urls: string;
  username?: string;
  credential?: string;
}

/**
 * GET /api/ice/config
 * Returns ICE servers for WebRTC peer connections.
 * No auth required — clients need this before they log in.
 * Falls back to Google's public STUN if nothing is configured.
 */
// Free public TURN servers (Open Relay by metered.ca) — work globally, no setup needed.
// Replaced automatically when TURN_URL/USERNAME/PASSWORD env vars are set.
const FREE_TURN_SERVERS: IceServer[] = [
  { urls: "turn:openrelay.metered.ca:80",               username: "openrelayproject", credential: "openrelayproject" },
  { urls: "turn:openrelay.metered.ca:443",              username: "openrelayproject", credential: "openrelayproject" },
  { urls: "turns:openrelay.metered.ca:443",             username: "openrelayproject", credential: "openrelayproject" },
  { urls: "turn:openrelay.metered.ca:80?transport=tcp", username: "openrelayproject", credential: "openrelayproject" },
];

router.get("/config", (_req, res) => {
  const servers: IceServer[] = [];

  servers.push({ urls: env.stunUrl ?? "stun:stun.l.google.com:19302" });

  if (env.turnUrl && env.turnUsername && env.turnPassword) {
    // Custom TURN configured via env vars — use it
    servers.push({
      urls: env.turnUrl,
      username: env.turnUsername,
      credential: env.turnPassword
    });
  } else {
    // No custom TURN — use free public relay so WebRTC works across the internet
    servers.push(...FREE_TURN_SERVERS);
  }

  const hasTurn = !!(env.turnUrl && env.turnUsername && env.turnPassword) || true;

  res.json({
    success: true,
    data: { iceServers: servers, hasTurn }
  });
});

export default router;
