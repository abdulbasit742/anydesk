import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { TaxProfileRecordService } from "./taxProfilesService.js";

export function registerTaxProfileRecordRoutes(router: Router, service: TaxProfileRecordService): void {
  router.get("/pack17/taxProfiles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/taxProfiles", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
