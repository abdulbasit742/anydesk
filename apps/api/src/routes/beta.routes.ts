import { Router } from "express";
import { getBetaApiFeatureStatus } from "../middleware/betaFeatureGate.js";

const router = Router();

router.get("/features", (_req, res) => {
  res.json({
    service: "remotedesk-engine",
    status: "ok",
    features: getBetaApiFeatureStatus()
  });
});

export default router;
