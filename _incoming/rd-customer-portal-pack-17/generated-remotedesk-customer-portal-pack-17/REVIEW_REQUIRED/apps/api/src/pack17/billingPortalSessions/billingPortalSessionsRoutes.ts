import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { BillingPortalSessionRecordService } from "./billingPortalSessionsService.js";

export function registerBillingPortalSessionRecordRoutes(router: Router, service: BillingPortalSessionRecordService): void {
  router.get("/pack17/billingPortalSessions", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/billingPortalSessions", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
