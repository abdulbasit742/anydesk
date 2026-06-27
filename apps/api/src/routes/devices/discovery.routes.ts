import { Router } from "express";
const router = Router();
router.post("/scan", (req, res) => res.json({ devices: [] }));
router.post("/register", (req, res) => res.status(201).json({ device: {} }));
router.get("/online", (req, res) => res.json({ devices: [] }));
router.get("/by-type/:type", (req, res) => res.json({ devices: [] }));
export default router;
