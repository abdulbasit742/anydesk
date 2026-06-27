import { Router } from "express";
const router = Router();
router.post("/connect", (req, res) => res.json({ sessionId: "sess_123", token: "sig_token" }));
router.post("/:sessionId/accept", (req, res) => res.json({ connected: true }));
router.post("/:sessionId/reject", (req, res) => res.json({ rejected: true }));
router.post("/:sessionId/end", (req, res) => res.json({ ended: true }));
router.get("/active", (req, res) => res.json({ connections: [] }));
router.get("/history", (req, res) => res.json({ history: [] }));
export default router;
