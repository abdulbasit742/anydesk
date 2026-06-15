import type { Router } from "express";
import { pack9Route } from "../common/pack9Route.js";
import { requireLaunchAdmin } from "../common/launchAuth.js";
import type { SessionQualityAggregateRecordService } from "./sessionQualityAggregatesService.js";
export function registerSessionQualityAggregateRecordRoutes(router: Router, service: SessionQualityAggregateRecordService): void { router.get("/pack9/sessionQualityAggregates", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post("/pack9/sessionQualityAggregates", requireLaunchAdmin, pack9Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }
