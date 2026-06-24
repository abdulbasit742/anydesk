import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
router.use(requireAuth);

const limits = {
  FREE: { maxDevices: 1, maxSessionSeconds: 3600, fileTransfer: false },
  PRO: { maxDevices: 5, maxSessionSeconds: null, fileTransfer: true },
  BUSINESS: { maxDevices: null, maxSessionSeconds: null, fileTransfer: true },
  ENTERPRISE: { maxDevices: null, maxSessionSeconds: null, fileTransfer: true }
};

router.get("/current", asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { plan: true } });
  const plan = user?.plan ?? "FREE";
  res.json({ success: true, data: { plan, limits: limits[plan] } });
}));

router.post("/checkout", asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      url: "https://dashboard.stripe.com/test/apikeys",
      note: "Wire Stripe checkout here after adding live price IDs."
    }
  });
}));

export default router;
