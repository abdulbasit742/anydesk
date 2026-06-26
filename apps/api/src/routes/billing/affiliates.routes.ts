import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { affiliateService } from "../../services/affiliateService.js";

const router = Router();

/**
 * Join affiliate program
 */
router.post(
  "/join",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const profile = await affiliateService.createAffiliateProfile(req.user!.id);

    res.json({
      success: true,
      data: profile,
    });
  })
);

/**
 * Get affiliate profile
 */
router.get(
  "/profile",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const profile = await affiliateService.getAffiliateProfile(req.user!.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Not an affiliate" });
    }

    res.json({
      success: true,
      data: profile,
    });
  })
);

/**
 * Get referral link
 */
router.get(
  "/referral-link",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const profile = await affiliateService.getAffiliateProfile(req.user!.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Not an affiliate" });
    }

    const referralLink = affiliateService.getReferralLink(profile.referralCode);

    res.json({
      success: true,
      data: { referralLink, referralCode: profile.referralCode },
    });
  })
);

/**
 * Get affiliate commissions
 */
router.get(
  "/commissions",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const profile = await affiliateService.getAffiliateProfile(req.user!.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Not an affiliate" });
    }

    const commissions = await affiliateService.calculateCommissions(profile.id);

    res.json({
      success: true,
      data: {
        ...commissions,
        referralCount: profile.referrals.length,
        activeReferrals: profile.referrals.filter((r: any) => r.status === "active").length,
      },
    });
  })
);

/**
 * Get affiliate referrals
 */
router.get(
  "/referrals",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const profile = await affiliateService.getAffiliateProfile(req.user!.id);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Not an affiliate" });
    }

    res.json({
      success: true,
      data: profile.referrals,
    });
  })
);

export default router;
