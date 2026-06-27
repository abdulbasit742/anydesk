import { Router } from "express";
const router = Router();
router.get("/logs", (req, res) => res.json({ logs: [] }));
router.get("/report", (req, res) => res.json({ report: {} }));
router.get("/export", (req, res) => res.json({ url: "/export.csv" }));
export default router;
