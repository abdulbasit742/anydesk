import { Router } from "express";
const router = Router();
router.get("/search", async (req, res) => { res.json({ logs: [], total: 0, query: req.query.q }); });
router.get("/:deviceId", async (req, res) => { res.json({ logs: [], total: 0 }); });
router.get("/:deviceId/stream", async (req, res) => { res.setHeader("Content-Type", "text/event-stream"); res.write("data: {}\n\n"); });
export default router;
