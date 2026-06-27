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
router.get("/config", (_req, res) => {
  const servers: IceServer[] = [];

  servers.push({ urls: env.stunUrl ?? "stun:stun.l.google.com:19302" });

  if (env.turnUrl && env.turnUsername && env.turnPassword) {
    servers.push({
      urls: env.turnUrl,
      username: env.turnUsername,
      credential: env.turnPassword
    });
  }

  res.json({
    success: true,
    data: {
      iceServers: servers,
      hasTurn: !!(env.turnUrl && env.turnUsername && env.turnPassword)
    }
  });
});

export default router;
