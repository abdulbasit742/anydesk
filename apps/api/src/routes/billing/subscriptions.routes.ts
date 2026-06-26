import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { stripeBillingService, SUBSCRIPTION_PLANS } from "../../services/stripeBilling.js";
import { usageTrackingService } from "../../services/usageTracking.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

/**
 * Get current subscription
 */
router.get(
  "/current",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const subscription = await stripeBillingService.getSubscription(req.user!.id);

    res.json({
      success: true,
      data: subscription || {
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodEnd: null,
      },
    });
  })
);

/**
 * Get available plans
 */
router.get(
  "/plans",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      id: key,
      ...plan,
    }));

    res.json({
      success: true,
      data: plans,
    });
  })
);

/**
 * Create checkout session
 */
router.post(
  "/checkout",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, error: "Plan ID required" });
    }

    const successUrl = `${process.env.DASHBOARD_URL}/billing/success`;
    const cancelUrl = `${process.env.DASHBOARD_URL}/billing/cancel`;

    const checkoutUrl = await stripeBillingService.createCheckoutSession(
      req.user!.id,
      planId,
      successUrl,
      cancelUrl
    );

    res.json({
      success: true,
      data: { url: checkoutUrl },
    });
  })
);

/**
 * Cancel subscription
 */
router.post(
  "/cancel",
  asyncHandler<AuthedRequest>(async (req, res) => {
    await stripeBillingService.cancelSubscription(req.user!.id);

    res.json({
      success: true,
      message: "Subscription canceled at end of period",
    });
  })
);

/**
 * Resume subscription
 */
router.post(
  "/resume",
  asyncHandler<AuthedRequest>(async (req, res) => {
    await stripeBillingService.resumeSubscription(req.user!.id);

    res.json({
      success: true,
      message: "Subscription resumed",
    });
  })
);

/**
 * Update subscription plan
 */
router.post(
  "/upgrade",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, error: "Plan ID required" });
    }

    await stripeBillingService.updateSubscriptionPlan(req.user!.id, planId);

    res.json({
      success: true,
      message: "Subscription updated",
    });
  })
);

/**
 * Get billing portal
 */
router.get(
  "/portal",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const returnUrl = `${process.env.DASHBOARD_URL}/billing`;

    const portalUrl = await stripeBillingService.getBillingPortalSession(
      req.user!.id,
      returnUrl
    );

    res.json({
      success: true,
      data: { url: portalUrl },
    });
  })
);

/**
 * Get current usage
 */
router.get(
  "/usage",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const usage = await usageTrackingService.getCurrentUsage(req.user!.id);
    const subscription = await stripeBillingService.getSubscription(req.user!.id);
    const limits = await usageTrackingService.checkLimits(
      req.user!.id,
      subscription?.plan || "FREE"
    );

    res.json({
      success: true,
      data: {
        usage,
        limits: limits.limits,
        exceeded: limits.exceeded,
      },
    });
  })
);

/**
 * Get usage history
 */
router.get(
  "/usage/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const days = parseInt(req.query.days as string) || 30;
    const history = await usageTrackingService.getUsageHistory(req.user!.id, days);

    res.json({
      success: true,
      data: history,
    });
  })
);

/**
 * Get invoices
 */
router.get(
  "/invoices",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({
      success: true,
      data: invoices,
    });
  })
);

/**
 * Get single invoice
 */
router.get(
  "/invoices/:invoiceId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.invoiceId },
    });

    if (!invoice || invoice.userId !== req.user!.id) {
      return res.status(404).json({ success: false, error: "Invoice not found" });
    }

    res.json({
      success: true,
      data: invoice,
    });
  })
);

export default router;
