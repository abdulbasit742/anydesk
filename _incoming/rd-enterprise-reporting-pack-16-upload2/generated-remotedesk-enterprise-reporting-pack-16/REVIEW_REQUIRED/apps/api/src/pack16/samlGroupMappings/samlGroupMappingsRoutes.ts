import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { SamlGroupMappingRecordService } from "./samlGroupMappingsService.js";

export function registerSamlGroupMappingRecordRoutes(router: Router, service: SamlGroupMappingRecordService): void {
  router.get("/pack16/samlGroupMappings", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/samlGroupMappings", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
