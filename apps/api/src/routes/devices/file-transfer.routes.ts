import { Router } from "express";
const router = Router();
router.post("/initiate", (req, res) => res.json({ transferId: "tf_123" }));
router.post("/:transferId/progress", (req, res) => res.json({ progress: 50 }));
router.post("/:transferId/cancel", (req, res) => res.json({ cancelled: true }));
router.get("/:sessionId/history", (req, res) => res.json({ transfers: [] }));
export default router;
