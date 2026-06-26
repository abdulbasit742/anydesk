import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { analyticsService } from "../../services/analyticsService.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

/**
 * Get overall analytics
 */
router.get(
  "/overview",
  asyncHandler<AuthedRequest>(async (req, res) => {
    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const days = parseInt(req.query.days as string) || 30;
    const analytics = await analyticsService.getAnalytics(days);

    res.json({
      success: true,
      data: analytics,
    });
  })
);

/**
 * Get revenue metrics
 */
router.get(
  "/revenue",
  asyncHandler<AuthedRequest>(async (req, res) => {
    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const days = parseInt(req.query.days as string) || 30;
    const metrics = await analyticsService.getRevenueMetrics(days);

    res.json({
      success: true,
      data: metrics,
    });
  })
);

/**
 * Get retention metrics
 */
router.get(
  "/retention",
  asyncHandler<AuthedRequest>(async (req, res) => {
    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const metrics = await analyticsService.getRetentionMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  })
);

/**
 * Get user analytics (for personal dashboard)
 */
router.get(
  "/user",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const usage = await prisma.billingUsage.groupBy({
      by: ["metric"],
      where: {
        userId: req.user!.id,
        periodStart: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: {
        quantity: true,
      },
    });

    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { hostId: req.user!.id },
          { clientId: req.user!.id },
        ],
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: {
        startedAt: true,
        endedAt: true,
      },
    });

    let totalDuration = 0;
    for (const session of sessions) {
      if (session.endedAt && session.startedAt) {
        totalDuration += session.endedAt.getTime() - session.startedAt.getTime();
      }
    }

    res.json({
      success: true,
      data: {
        usage,
        sessionCount: sessions.length,
        averageSessionDuration: sessions.length > 0
          ? Math.round(totalDuration / sessions.length / 1000)
          : 0,
      },
    });
  })
);

export default router;
