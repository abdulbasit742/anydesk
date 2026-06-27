import { Router } from "express";
const router = Router();
router.post("/", async (req, res) => { res.json({ recorded: true }); });
router.get("/:deviceId/latest", async (req, res) => { res.json({ metrics: { cpu: 45, ram: 62, disk: 38, network: { in: 1024, out: 512 } } }); });
router.get("/:deviceId/history", async (req, res) => { res.json({ history: [], period: req.query.period || "24h" }); });
router.get("/:deviceId/summary", async (req, res) => { res.json({ summary: { avgCpu: 40, avgRam: 55, avgDisk: 35, uptime: 99.9 } }); });
export default router;
