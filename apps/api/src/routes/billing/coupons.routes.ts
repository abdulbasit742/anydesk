import { Router } from "express";
const router = Router();
router.post("/", (req, res) => res.status(201).json({ coupon: {} }));
router.post("/validate", (req, res) => res.json({ valid: true, discount: 20 }));
router.get("/", (req, res) => res.json({ coupons: [] }));
router.delete("/:couponId", (req, res) => res.json({ deleted: true }));
export default router;
