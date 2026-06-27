import { Router } from "express";
const router = Router();
router.post("/", (req, res) => res.status(201).json({ webhook: {} }));
router.get("/", (req, res) => res.json({ webhooks: [] }));
router.delete("/:webhookId", (req, res) => res.json({ deleted: true }));
router.get("/:webhookId/deliveries", (req, res) => res.json({ deliveries: [] }));
export default router;
