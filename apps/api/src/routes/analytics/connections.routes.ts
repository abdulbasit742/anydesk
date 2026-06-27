import { Router } from "express";
const router = Router();
router.get("/total", (req, res) => res.json({ total: 0 }));
router.get("/avg-duration", (req, res) => res.json({ avgDuration: 0 }));
router.get("/peak-hours", (req, res) => res.json({ peakHours: [] }));
router.get("/bandwidth", (req, res) => res.json({ totalGB: 0, avgMbps: 0 }));
export default router;
