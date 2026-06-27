import { Router } from "express";
const router = Router();
router.get("/google", (req, res) => res.json({ url: "/auth/google/callback" }));
router.get("/google/callback", (req, res) => res.json({ success: true }));
router.get("/microsoft", (req, res) => res.json({ url: "/auth/microsoft/callback" }));
router.get("/microsoft/callback", (req, res) => res.json({ success: true }));
router.get("/github", (req, res) => res.json({ url: "/auth/github/callback" }));
router.get("/github/callback", (req, res) => res.json({ success: true }));
export default router;
