import type { Router } from "express";
import { pack22Route } from "../common/pack22Route.js";
import { requireQaAdmin } from "../common/qaAdminAuth.js";
import type { SyntheticProbeResultRecordService } from "./syntheticProbeResultsService.js";

export function registerSyntheticProbeResultRecordRoutes(router: Router, service: SyntheticProbeResultRecordService): void {
  router.get("/pack22/syntheticProbeResults", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack22/syntheticProbeResults", requireQaAdmin, pack22Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
