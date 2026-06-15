import type { Router } from "express";
import { pack17Route } from "../common/pack17Route.js";
import { requirePortalAccess } from "../common/portalAuth.js";
import type { PublicStatusComponentRecordService } from "./publicStatusComponentsService.js";

export function registerPublicStatusComponentRecordRoutes(router: Router, service: PublicStatusComponentRecordService): void {
  router.get("/pack17/publicStatusComponents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack17/publicStatusComponents", requirePortalAccess, pack17Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
