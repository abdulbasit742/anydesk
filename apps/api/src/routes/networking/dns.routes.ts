import { Router } from "express";
const router = Router();
router.post("/:networkId/records", (req, res) => res.status(201).json({ record: {} }));
router.get("/:networkId/records", (req, res) => res.json({ records: [] }));
router.put("/records/:recordId", (req, res) => res.json({ record: {} }));
router.delete("/records/:recordId", (req, res) => res.json({ deleted: true }));
router.get("/:networkId/resolve/:name", (req, res) => res.json({ value: "10.0.0.1" }));
export default router;
