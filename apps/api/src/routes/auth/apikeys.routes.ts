import { Router } from "express";
const router = Router();
router.post("/", (req, res) => res.json({ key: "rdk_..." }));
router.get("/", (req, res) => res.json({ keys: [] }));
router.delete("/:keyId", (req, res) => res.json({ revoked: true }));
export default router;
