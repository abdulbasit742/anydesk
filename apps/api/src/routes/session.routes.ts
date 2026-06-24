import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get("/history", asyncHandler<AuthedRequest>(async (req, res) => {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }]
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ success: true, data: sessions });
}));

export default router;
