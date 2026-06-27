import { Router } from "express";
const router = Router();
router.get("/export", (req, res) => res.json({ data: {} }));
router.post("/delete", (req, res) => res.json({ deleted: true }));
router.get("/consent", (req, res) => res.json({ consents: [] }));
router.post("/consent", (req, res) => res.json({ recorded: true }));
export default router;
