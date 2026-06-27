import { Router } from "express";
const router = Router();
router.post("/wake", (req, res) => res.json({ sent: true }));
router.post("/schedule", (req, res) => res.json({ scheduled: true }));
export default router;
