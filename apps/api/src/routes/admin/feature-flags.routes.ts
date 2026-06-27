import { Router } from "express";
const router = Router();
router.get("/", async (req, res) => { res.json({ flags: [] }); });
router.post("/", async (req, res) => { res.json({ flag: { id: `flag_${Date.now()}`, ...req.body } }); });
router.put("/:id", async (req, res) => { res.json({ updated: true }); });
router.delete("/:id", async (req, res) => { res.json({ deleted: true }); });
router.post("/:id/toggle", async (req, res) => { res.json({ toggled: true }); });
export default router;
