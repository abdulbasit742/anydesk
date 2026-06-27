import { Router } from "express";
const router = Router();
router.post("/restart", async (req, res) => { res.json({ action: "restart", deviceCount: req.body.deviceIds?.length || 0, status: "queued" }); });
router.post("/shutdown", async (req, res) => { res.json({ action: "shutdown", deviceCount: req.body.deviceIds?.length || 0, status: "queued" }); });
router.post("/update", async (req, res) => { res.json({ action: "update", deviceCount: req.body.deviceIds?.length || 0, status: "queued" }); });
router.post("/execute-script", async (req, res) => { res.json({ action: "execute_script", deviceCount: req.body.deviceIds?.length || 0, status: "queued" }); });
router.post("/install-package", async (req, res) => { res.json({ action: "install_package", deviceCount: req.body.deviceIds?.length || 0, status: "queued" }); });
export default router;
