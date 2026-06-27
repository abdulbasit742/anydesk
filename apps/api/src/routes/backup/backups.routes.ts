import { Router } from "express";
const router = Router();
router.post("/", (req, res) => res.status(201).json({ backup: {} }));
router.get("/:deviceId", (req, res) => res.json({ backups: [] }));
router.post("/:backupId/verify", (req, res) => res.json({ valid: true }));
router.post("/:backupId/restore", (req, res) => res.json({ restoring: true }));
router.post("/schedule", (req, res) => res.json({ schedule: {} }));
router.get("/:deviceId/schedules", (req, res) => res.json({ schedules: [] }));
export default router;
