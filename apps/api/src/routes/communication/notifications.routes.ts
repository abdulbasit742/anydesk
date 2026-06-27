import { Router } from "express";
const router = Router();
router.get("/", (req, res) => res.json({ notifications: [] }));
router.get("/unread-count", (req, res) => res.json({ count: 0 }));
router.post("/:id/read", (req, res) => res.json({ read: true }));
router.post("/read-all", (req, res) => res.json({ readAll: true }));
export default router;
