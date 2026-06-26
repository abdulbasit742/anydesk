import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { dismissAnomaly, evaluateSample, listAnomalies, type AnomalyType } from "../services/anomaly.service.js";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
  res.json({ data: await listAnomalies(deviceId) });
});

router.post("/sample", requireAuth, async (req: Request, res: Response) => {
  const body = req.body as {
    deviceId?: string;
    type?: AnomalyType;
    metric?: string;
    value?: number;
  };

  if (!body.deviceId || !body.type || !body.metric || typeof body.value !== "number") {
    return res.status(400).json({ success: false, message: "deviceId, type, metric, value required" });
  }

  const anomaly = await evaluateSample({
    deviceId: body.deviceId,
    type: body.type,
    metric: body.metric,
    value: body.value
  });

  res.json({ data: { anomaly } });
});

router.post("/:id/dismiss", requireAuth, async (req: Request, res: Response) => {
  const falsePositive = Boolean((req.body as { falsePositive?: boolean }).falsePositive);
  await dismissAnomaly(req.params.id, falsePositive);
  res.json({ data: { ok: true } });
});

export default router;
