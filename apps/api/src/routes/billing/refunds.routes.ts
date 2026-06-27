import { Router } from "express";
const router = Router();
router.post("/", (req, res) => res.status(201).json({ refund: {} }));
router.get("/", (req, res) => res.json({ refunds: [] }));
router.post("/:refundId/approve", (req, res) => res.json({ approved: true }));
export default router;
