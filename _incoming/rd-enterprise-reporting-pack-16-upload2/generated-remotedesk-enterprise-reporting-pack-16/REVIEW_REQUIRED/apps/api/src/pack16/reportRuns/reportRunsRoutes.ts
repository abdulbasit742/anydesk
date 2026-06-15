import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { ReportRunRecordService } from "./reportRunsService.js";

export function registerReportRunRecordRoutes(router: Router, service: ReportRunRecordService): void {
  router.get("/pack16/reportRuns", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/reportRuns", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
