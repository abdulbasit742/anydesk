import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { TeamConnectorRecordService } from "./teamConnectorsService.js";

export function registerTeamConnectorRecordRoutes(router: Router, service: TeamConnectorRecordService): void {
  router.get("/pack10/teamConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/teamConnectors", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
