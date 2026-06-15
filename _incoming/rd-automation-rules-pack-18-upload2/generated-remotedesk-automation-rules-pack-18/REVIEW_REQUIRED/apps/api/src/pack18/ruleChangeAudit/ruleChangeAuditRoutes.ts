import type { Router } from "express";
import { pack18Route } from "../common/pack18Route.js";
import { requireAutomationAdmin } from "../common/automationAdminAuth.js";
import type { RuleChangeAuditRecordService } from "./ruleChangeAuditService.js";

export function registerRuleChangeAuditRecordRoutes(router: Router, service: RuleChangeAuditRecordService): void {
  router.get("/pack18/ruleChangeAudit", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack18/ruleChangeAudit", requireAutomationAdmin, pack18Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
