import type { Router } from "express";
import { pack10Route } from "../common/pack10Route.js";
import { requireIntegrationAdmin } from "../common/integrationAuth.js";
import type { ZendeskMappingRecordService } from "./zendeskMappingsService.js";

export function registerZendeskMappingRecordRoutes(router: Router, service: ZendeskMappingRecordService): void {
  router.get("/pack10/zendeskMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack10/zendeskMappings", requireIntegrationAdmin, pack10Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
