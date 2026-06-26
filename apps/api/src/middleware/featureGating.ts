import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { usageTrackingService } from "../services/usageTracking.js";

export interface AuthedRequest extends Request {
  user?: { id: string };
}

/**
 * Feature gating middleware
 * Checks if user has access to a feature based on their plan
 */
export const featureGate = (feature: string) => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const plan = user.plan || "FREE";

    // Define feature access by plan
    const featureAccess: Record<string, string[]> = {
      file_transfer: ["PRO", "BUSINESS", "ENTERPRISE"],
      session_recording: ["BUSINESS", "ENTERPRISE"],
      team_management: ["BUSINESS", "ENTERPRISE"],
      white_labeling: ["ENTERPRISE"],
      license_keys: ["PRO", "BUSINESS", "ENTERPRISE"],
      api_access: ["PRO", "BUSINESS", "ENTERPRISE"],
      priority_support: ["BUSINESS", "ENTERPRISE"],
      custom_domain: ["ENTERPRISE"],
      sso: ["ENTERPRISE"],
    };

    const allowedPlans = featureAccess[feature] || [];

    if (!allowedPlans.includes(plan)) {
      return res.status(403).json({
        success: false,
        error: `Feature '${feature}' not available on ${plan} plan`,
        requiredPlan: allowedPlans[0] || "PRO",
      });
    }

    next();
  };
};

/**
 * Rate limiting middleware
 * Limits API calls based on plan
 */
export const rateLimitByPlan = () => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const plan = user.plan || "FREE";

    // Define rate limits by plan (requests per hour)
    const rateLimits: Record<string, number> = {
      FREE: 100,
      PRO: 1000,
      BUSINESS: 10000,
      ENTERPRISE: null, // unlimited
    };

    const limit = rateLimits[plan];

    // TODO: Implement actual rate limiting with Redis
    // For now, just pass through
    next();
  };
};

/**
 * Session duration limit middleware
 * Enforces session duration limits based on plan
 */
export const enforceSessionDurationLimit = () => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const plan = user.plan || "FREE";

    // Define session duration limits by plan (in seconds)
    const sessionLimits: Record<string, number | null> = {
      FREE: 30 * 60, // 30 minutes
      PRO: null, // unlimited
      BUSINESS: null, // unlimited
      ENTERPRISE: null, // unlimited
    };

    const limit = sessionLimits[plan];

    // Store limit in request for later use
    (req as any).sessionDurationLimit = limit;

    next();
  };
};

/**
 * Device count limit middleware
 * Enforces device count limits based on plan
 */
export const enforceDeviceCountLimit = () => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const plan = user.plan || "FREE";

    // Define device count limits by plan
    const deviceLimits: Record<string, number | null> = {
      FREE: 1,
      PRO: 5,
      BUSINESS: null, // unlimited
      ENTERPRISE: null, // unlimited
    };

    const limit = deviceLimits[plan];

    if (limit !== null) {
      const deviceCount = await prisma.device.count({
        where: { userId: req.user.id },
      });

      if (deviceCount >= limit) {
        return res.status(403).json({
          success: false,
          error: `Device limit (${limit}) reached for ${plan} plan`,
          currentCount: deviceCount,
          limit,
        });
      }
    }

    next();
  };
};

/**
 * Usage limit check middleware
 * Checks if user has exceeded usage limits
 */
export const checkUsageLimits = () => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const plan = user.plan || "FREE";

    const { exceeded, limits } = await usageTrackingService.checkLimits(
      req.user.id,
      plan
    );

    if (exceeded) {
      return res.status(429).json({
        success: false,
        error: "Usage limit exceeded",
        limits,
      });
    }

    next();
  };
};

/**
 * Trial expiration check middleware
 * Checks if trial has expired and downgrades to free plan
 */
export const checkTrialExpiration = () => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    if (
      subscription &&
      subscription.status === "TRIALING" &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date()
    ) {
      // Trial expired, downgrade to free
      await prisma.subscription.update({
        where: { userId: req.user.id },
        data: {
          status: "CANCELED",
          plan: "FREE",
        },
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: { plan: "FREE" },
      });

      return res.status(403).json({
        success: false,
        error: "Trial period has expired. Please upgrade to continue.",
      });
    }

    next();
  };
};
