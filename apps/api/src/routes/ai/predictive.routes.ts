import { Router } from "express";
const router = Router();
router.get("/:deviceId/predict", (req, res) => res.json({ riskLevel: "low", recommendations: [] }));
router.get("/maintenance-schedule", (req, res) => res.json({ schedule: [] }));
export default router;
