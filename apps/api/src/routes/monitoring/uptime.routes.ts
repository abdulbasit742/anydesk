import { Router } from "express";
const router = Router();
router.get("/", async (req, res) => { res.json({ overall: 99.95, devices: [] }); });
router.get("/:deviceId", async (req, res) => { res.json({ deviceId: req.params.deviceId, uptime: 99.99, history: [] }); });
router.get("/:deviceId/incidents", async (req, res) => { res.json({ incidents: [] }); });
export default router;
