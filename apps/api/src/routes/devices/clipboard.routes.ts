import { Router } from "express";
const router = Router();
router.post("/sync", (req, res) => res.json({ synced: true }));
router.get("/:sessionId/history", (req, res) => res.json({ history: [] }));
router.delete("/:sessionId/clear", (req, res) => res.json({ cleared: true }));
export default router;
