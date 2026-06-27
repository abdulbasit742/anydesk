import { Router } from "express";
const router = Router();
router.post("/networks", (req, res) => res.status(201).json({ network: {} }));
router.get("/networks", (req, res) => res.json({ networks: [] }));
router.post("/networks/:networkId/peers", (req, res) => res.json({ peer: {} }));
router.delete("/networks/:networkId/peers/:deviceId", (req, res) => res.json({ removed: true }));
router.get("/networks/:networkId/peers", (req, res) => res.json({ peers: [] }));
export default router;
