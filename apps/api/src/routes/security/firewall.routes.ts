import { Router } from "express";
const router = Router();
router.post("/:deviceId/rules", (req, res) => res.status(201).json({ rule: {} }));
router.get("/:deviceId/rules", (req, res) => res.json({ rules: [] }));
router.delete("/rules/:ruleId", (req, res) => res.json({ deleted: true }));
router.post("/:deviceId/block-ip", (req, res) => res.json({ blocked: true }));
router.get("/:deviceId/blocked-ips", (req, res) => res.json({ blocked: [] }));
export default router;
