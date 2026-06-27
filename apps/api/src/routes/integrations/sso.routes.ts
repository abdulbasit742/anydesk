import { Router } from "express";
const router = Router();
router.get("/providers", async (req, res) => { res.json({ providers: ["google", "microsoft", "okta", "saml"] }); });
router.post("/configure", async (req, res) => { res.json({ configured: true, provider: req.body.provider }); });
router.get("/callback/:provider", async (req, res) => { res.redirect("/dashboard"); });
router.post("/saml/metadata", async (req, res) => { res.json({ metadata: "" }); });
export default router;
