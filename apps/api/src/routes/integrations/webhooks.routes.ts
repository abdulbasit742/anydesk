import { Router } from "express";
const router = Router();
router.get("/", async (req, res) => { res.json({ webhooks: [] }); });
router.post("/", async (req, res) => { res.json({ webhook: { id: `wh_${Date.now()}`, ...req.body } }); });
router.put("/:id", async (req, res) => { res.json({ updated: true }); });
router.delete("/:id", async (req, res) => { res.json({ deleted: true }); });
router.post("/:id/test", async (req, res) => { res.json({ delivered: true, statusCode: 200 }); });
router.get("/:id/deliveries", async (req, res) => { res.json({ deliveries: [] }); });
export default router;
