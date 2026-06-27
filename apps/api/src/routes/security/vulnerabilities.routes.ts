import { Router } from "express";
const router = Router();
router.post("/:deviceId/scan", (req, res) => res.json({ scanning: true }));
router.get("/", (req, res) => res.json({ vulnerabilities: [] }));
router.post("/:vulnId/patch", (req, res) => res.json({ patched: true }));
router.get("/stats", (req, res) => res.json({ total: 0, critical: 0 }));
export default router;
