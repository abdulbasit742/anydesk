import type { Router } from "express";
import { pack22Route } from "../common/pack22Route.js";
import { requireQaAdmin } from "../common/qaAdminAuth.js";
import type { CoverageReportRecordService } from "./coverageReportsService.js";

export function registerCoverageReportRecordRoutes(router: Router, service: CoverageReportRecordService): void {
  router.get("/pack22/coverageReports", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack22/coverageReports", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
