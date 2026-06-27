import { Router } from "express";
const router = Router();
router.post("/upload", (req, res) => res.json({ url: "https://storage.remotedesk.io/file" }));
router.get("/signed-url/:key", (req, res) => res.json({ url: "https://..." }));
router.delete("/:key", (req, res) => res.json({ deleted: true }));
router.get("/list", (req, res) => res.json({ files: [] }));
export default router;
