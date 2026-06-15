import type { Router } from "express";
import { pack22Route } from "../common/pack22Route.js";
import { requireQaAdmin } from "../common/qaAdminAuth.js";
import type { TestResultRecordService } from "./testResultsService.js";

export function registerTestResultRecordRoutes(router: Router, service: TestResultRecordService): void {
  router.get("/pack22/testResults", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack22/testResults", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
