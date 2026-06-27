import { Router } from "express";
const router = Router();
router.get("/", (req, res) => res.json({ invoices: [] }));
router.get("/:invoiceId", (req, res) => res.json({ invoice: {} }));
router.get("/:invoiceId/pdf", (req, res) => res.json({ url: "/invoice.pdf" }));
router.post("/", (req, res) => res.status(201).json({ invoice: {} }));
export default router;
