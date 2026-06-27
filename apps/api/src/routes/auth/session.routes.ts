import { Router } from "express";
const router = Router();
router.get("/active", (req, res) => res.json({ sessions: [] }));
router.delete("/:sessionId", (req, res) => res.json({ revoked: true }));
router.delete("/all", (req, res) => res.json({ revokedAll: true }));
export default router;
