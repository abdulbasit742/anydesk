/**
 * Cluster Aggregate Stats Route
 *
 * GET /api/clusters/:clusterId/stats — Returns aggregated resource stats for the cluster
 */

import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getClusterAggregateStats } from "./resourceAggregator.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/:clusterId/stats",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        OR: [
          { ownerId: req.user.id },
          { nodes: { some: { userId: req.user.id } } },
        ],
      },
    });
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });
    const stats = await getClusterAggregateStats(clusterId);
    res.json({ stats });
  })
);

export default router;
