import type { Router } from "express";
import { pack19Route } from "../common/pack19Route.js";
import { requireResidencyAdmin } from "../common/residencyAdminAuth.js";
import type { ResidencyAuditRecordService } from "./residencyAuditService.js";

export function registerResidencyAuditRecordRoutes(router: Router, service: ResidencyAuditRecordService): void {
  router.get("/pack19/residencyAudit", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack19/residencyAudit", requireResidencyAdmin, pack19Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
