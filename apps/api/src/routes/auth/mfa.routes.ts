import { Router } from "express";
const router = Router();
router.post("/enable", (req, res) => res.json({ secret: "TOTP_SECRET", qrCode: "otpauth://..." }));
router.post("/verify", (req, res) => res.json({ verified: true }));
router.post("/disable", (req, res) => res.json({ disabled: true }));
router.post("/backup-codes", (req, res) => res.json({ codes: ["code1", "code2"] }));
export default router;
