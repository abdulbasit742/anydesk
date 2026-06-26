import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { licenseKeyService } from "../../services/licenseKeyService.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();

/**
 * Validate license key (public endpoint)
 */
router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, error: "License key required" });
    }

    const result = await licenseKeyService.validateLicenseKey(key);

    res.json({
      success: result.valid,
      data: result.data,
      error: result.error,
    });
  })
);

/**
 * Activate license on device (public endpoint)
 */
router.post(
  "/activate",
  asyncHandler(async (req, res) => {
    const { licenseKeyId, deviceId, hardwareId } = req.body;

    if (!licenseKeyId || !deviceId || !hardwareId) {
      return res.status(400).json({
        success: false,
        error: "License key ID, device ID, and hardware ID required",
      });
    }

    const result = await licenseKeyService.activateLicenseKey(
      licenseKeyId,
      deviceId,
      hardwareId
    );

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({ success: true, message: "License activated" });
  })
);

/**
 * Check device activation (public endpoint)
 */
router.get(
  "/check/:hardwareId",
  asyncHandler(async (req, res) => {
    const { hardwareId } = req.params;

    const result = await licenseKeyService.checkDeviceActivation(hardwareId);

    res.json({
      success: true,
      data: result,
    });
  })
);

/**
 * Generate license key (authenticated)
 */
router.post(
  "/generate",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { plan, maxDevices, expiresInDays } = req.body;

    if (!plan || !maxDevices) {
      return res.status(400).json({
        success: false,
        error: "Plan and maxDevices required",
      });
    }

    const key = await licenseKeyService.generateLicenseKey(
      req.user!.id,
      plan,
      maxDevices,
      expiresInDays
    );

    res.json({
      success: true,
      data: { key },
    });
  })
);

/**
 * List user's license keys
 */
router.get(
  "/",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const keys = await licenseKeyService.getUserLicenseKeys(req.user!.id);

    res.json({
      success: true,
      data: keys,
    });
  })
);

/**
 * Revoke license key
 */
router.post(
  "/:licenseKeyId/revoke",
  requireAuth,
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { licenseKeyId } = req.params;

    // Verify ownership
    const licenseKey = await prisma.licenseKey.findUnique({
      where: { id: licenseKeyId },
    });

    if (!licenseKey || licenseKey.userId !== req.user!.id) {
      return res.status(404).json({ success: false, error: "License key not found" });
    }

    await licenseKeyService.revokeLicenseKey(licenseKeyId);

    res.json({
      success: true,
      message: "License key revoked",
    });
  })
);

export default router;
