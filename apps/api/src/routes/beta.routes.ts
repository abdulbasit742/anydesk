import { Router } from "express";
import { getBetaApiFeatureStatus } from "../middleware/betaFeatureGate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/features", asyncHandler(async (_req, res) => {
  res.json({
    service: "remotedesk-engine",
    status: "ok",
    features: getBetaApiFeatureStatus()
  });
}));

export default router;
