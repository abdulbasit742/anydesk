import type { Router } from "express";
import { pack16Route } from "../common/pack16Route.js";
import { requireEnterpriseAdmin } from "../common/enterpriseAdminAuth.js";
import type { EnterpriseAuditRecordService } from "./enterpriseAuditService.js";

export function registerEnterpriseAuditRecordRoutes(router: Router, service: EnterpriseAuditRecordService): void {
  router.get("/pack16/enterpriseAudit", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack16/enterpriseAudit", requireEnterpriseAdmin, pack16Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
