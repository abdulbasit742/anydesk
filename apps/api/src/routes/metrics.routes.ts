import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { producer } from "../server.js"; // Assuming producer is exported from server.ts

const router = Router();

router.post("/device-metrics", asyncHandler(async (req, res) => {
  const { deviceId, metrics } = req.body;
  if (!deviceId || !metrics) {
    return res.status(400).json({ success: false, message: "Missing deviceId or metrics" });
  }

  await producer.send({
    topic: "device-metrics",
    messages: [
      { value: JSON.stringify({ deviceId, timestamp: Date.now(), metrics }) },
    ],
  });

  res.json({ success: true, message: "Metrics received" });
}));

export default router;
