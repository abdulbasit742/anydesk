import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { MobileAuditRecordService } from './mobileAuditService.js';
export function registerMobileAuditRecordRoutes(router: Router, service: MobileAuditRecordService): void { router.get('/pack15/mobileAudit', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/mobileAudit', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }
