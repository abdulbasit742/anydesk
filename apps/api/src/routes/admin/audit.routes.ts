import { Router } from "express";
const router = Router();
router.get("/logs", async (req, res) => { res.json({ logs: [], total: 0, page: 1 }); });
router.get("/logs/export", async (req, res) => { res.json({ url: "", format: req.query.format || "csv" }); });
router.get("/logs/:id", async (req, res) => { res.json({ log: { id: req.params.id } }); });
export default router;
