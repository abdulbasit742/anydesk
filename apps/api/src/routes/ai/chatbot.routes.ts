import { Router } from "express";
const router = Router();
router.post("/message", (req, res) => res.json({ response: "How can I help?", actions: [] }));
router.get("/suggestions", (req, res) => res.json({ suggestions: [] }));
export default router;
