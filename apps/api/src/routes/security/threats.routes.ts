import { Router } from "express";
const router = Router();
router.get("/active", (req, res) => res.json({ threats: [] }));
router.post("/:threatId/acknowledge", (req, res) => res.json({ acknowledged: true }));
router.post("/:threatId/resolve", (req, res) => res.json({ resolved: true }));
router.get("/stats", (req, res) => res.json({ total: 0, critical: 0 }));
export default router;
