import { Router } from "express";
const router = Router();
router.get("/", async (req, res) => { res.json({ keys: [] }); });
router.post("/", async (req, res) => { const key = `rd_${require("crypto").randomBytes(32).toString("hex")}`; res.json({ key, id: `key_${Date.now()}`, name: req.body.name, createdAt: new Date() }); });
router.delete("/:id", async (req, res) => { res.json({ revoked: true }); });
router.put("/:id/rotate", async (req, res) => { res.json({ newKey: `rd_${Date.now()}` }); });
export default router;
