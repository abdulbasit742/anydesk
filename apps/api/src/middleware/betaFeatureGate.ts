import type { NextFunction, Request, Response } from "express";

export type BetaApiFeature =
  | "beta_engine"
  | "socket_access"
  | "signaling_access"
  | "desktop_consent"
  | "support_diagnostics"
  | "release_manifest";

const envByFeature: Record<BetaApiFeature, string> = {
  beta_engine: "BETA_ENGINE_ENABLED",
  socket_access: "BETA_SOCKET_ENABLED",
  signaling_access: "BETA_WEBRTC_SIGNALING_ENABLED",
  desktop_consent: "BETA_DESKTOP_CONSENT_ENABLED",
  support_diagnostics: "BETA_SUPPORT_DIAGNOSTICS_ENABLED",
  release_manifest: "BETA_RELEASE_MANIFEST_ENABLED"
};

const defaultEnabled: Record<BetaApiFeature, boolean> = {
  beta_engine: false,
  socket_access: true,
  signaling_access: false,
  desktop_consent: true,
  support_diagnostics: false,
  release_manifest: true
};

const truthy = new Set(["1", "true", "yes", "on", "enabled"]);
const falsy = new Set(["0", "false", "no", "off", "disabled"]);

export function isBetaApiFeatureEnabled(feature: BetaApiFeature): boolean {
  const value = process.env[envByFeature[feature]];
  if (!value) return defaultEnabled[feature];
  const normalized = value.trim().toLowerCase();
  if (truthy.has(normalized)) return true;
  if (falsy.has(normalized)) return false;
  return defaultEnabled[feature];
}

export function requireBetaApiFeature(feature: BetaApiFeature) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (isBetaApiFeatureEnabled(feature)) return next();
    return res.status(403).json({
      error: "feature_disabled",
      message: "This RemoteDesk beta capability is currently disabled by server policy.",
      feature
    });
  };
}

export function getBetaApiFeatureStatus(): Record<BetaApiFeature, boolean> {
  return {
    beta_engine: isBetaApiFeatureEnabled("beta_engine"),
    socket_access: isBetaApiFeatureEnabled("socket_access"),
    signaling_access: isBetaApiFeatureEnabled("signaling_access"),
    desktop_consent: isBetaApiFeatureEnabled("desktop_consent"),
    support_diagnostics: isBetaApiFeatureEnabled("support_diagnostics"),
    release_manifest: isBetaApiFeatureEnabled("release_manifest")
  };
}
