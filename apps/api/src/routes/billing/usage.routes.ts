import { Router } from "express";
const router = Router();
router.get("/summary", (req, res) => res.json({ usage: {} }));
router.get("/history", (req, res) => res.json({ history: [] }));
router.get("/limits", (req, res) => res.json({ limits: {} }));
export default router;
