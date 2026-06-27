import { Router } from "express";
const router = Router();
router.get("/jobs", (req, res) => res.json({ jobs: [] }));
router.post("/jobs/:jobId/execute", (req, res) => res.json({ executed: true }));
export default router;
