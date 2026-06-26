import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { organizationService } from "../../services/organizationService.js";
import { whiteLabelService } from "../../services/whiteLabelService.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

/**
 * Create organization
 */
router.post(
  "/",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Organization name required" });
    }

    const organization = await organizationService.createOrganization(
      req.user!.id,
      name,
      slug
    );

    res.json({
      success: true,
      data: organization,
    });
  })
);

/**
 * Get user's organizations
 */
router.get(
  "/",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const organizations = await organizationService.getUserOrganizations(req.user!.id);

    res.json({
      success: true,
      data: organizations,
    });
  })
);

/**
 * Get organization details
 */
router.get(
  "/:organizationId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;

    // Check membership
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId: req.user!.id } },
    });

    if (!member) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const organization = await organizationService.getOrganization(organizationId);

    res.json({
      success: true,
      data: organization,
    });
  })
);

/**
 * Update organization
 */
router.put(
  "/:organizationId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;
    const { name, slug } = req.body;

    // Check if owner
    const isOwner = await organizationService.isOwner(organizationId, req.user!.id);
    if (!isOwner) {
      return res.status(403).json({ success: false, error: "Only owner can update organization" });
    }

    const organization = await organizationService.updateOrganization(organizationId, {
      name,
      slug,
    });

    res.json({
      success: true,
      data: organization,
    });
  })
);

/**
 * Invite member
 */
router.post(
  "/:organizationId/members/invite",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email required" });
    }

    // Check if admin
    const isAdmin = await organizationService.isAdmin(organizationId, req.user!.id);
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: "Only admins can invite members" });
    }

    const invitation = await organizationService.inviteMember(
      organizationId,
      email,
      role || "MEMBER"
    );

    res.json({
      success: true,
      data: invitation,
    });
  })
);

/**
 * Get organization members
 */
router.get(
  "/:organizationId/members",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;

    // Check membership
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId: req.user!.id } },
    });

    if (!member) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    res.json({
      success: true,
      data: members,
    });
  })
);

/**
 * Update member role
 */
router.put(
  "/:organizationId/members/:memberId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, error: "Role required" });
    }

    // Check if admin
    const isAdmin = await organizationService.isAdmin(organizationId, req.user!.id);
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: "Only admins can update members" });
    }

    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.organizationId !== organizationId) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    const updated = await organizationService.updateMemberRole(
      organizationId,
      member.userId,
      role
    );

    res.json({
      success: true,
      data: updated,
    });
  })
);

/**
 * Remove member
 */
router.delete(
  "/:organizationId/members/:memberId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId, memberId } = req.params;

    // Check if admin
    const isAdmin = await organizationService.isAdmin(organizationId, req.user!.id);
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: "Only admins can remove members" });
    }

    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.organizationId !== organizationId) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    await organizationService.removeMember(organizationId, member.userId);

    res.json({
      success: true,
      message: "Member removed",
    });
  })
);

/**
 * Get white-label config
 */
router.get(
  "/:organizationId/white-label",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;

    // Check membership
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId: req.user!.id } },
    });

    if (!member) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const config = await whiteLabelService.getConfig(organizationId);

    res.json({
      success: true,
      data: config,
    });
  })
);

/**
 * Update white-label config
 */
router.put(
  "/:organizationId/white-label",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { organizationId } = req.params;
    const { appName, customDomain, logoUrl, primaryColor, supportEmail } = req.body;

    // Check if owner
    const isOwner = await organizationService.isOwner(organizationId, req.user!.id);
    if (!isOwner) {
      return res.status(403).json({ success: false, error: "Only owner can update white-label" });
    }

    // Validate custom domain if provided
    if (customDomain) {
      const validation = await whiteLabelService.validateCustomDomain(customDomain);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }
    }

    const config = await whiteLabelService.updateConfig(organizationId, {
      appName,
      customDomain,
      logoUrl,
      primaryColor,
      supportEmail,
    });

    res.json({
      success: true,
      data: config,
    });
  })
);

export default router;
