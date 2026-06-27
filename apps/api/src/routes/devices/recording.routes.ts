import { Router } from "express";
const router = Router();
router.post("/start", (req, res) => res.json({ recordingId: "rec_123" }));
router.post("/:recordingId/stop", (req, res) => res.json({ stopped: true }));
router.get("/", (req, res) => res.json({ recordings: [] }));
router.delete("/:recordingId", (req, res) => res.json({ deleted: true }));
export default router;
