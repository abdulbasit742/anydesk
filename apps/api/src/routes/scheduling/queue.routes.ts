import { Router } from "express";
const router = Router();
router.get("/", (req, res) => res.json({ queues: [] }));
router.get("/:queueName/size", (req, res) => res.json({ size: 0 }));
router.post("/:queueName/purge", (req, res) => res.json({ purged: true }));
export default router;
