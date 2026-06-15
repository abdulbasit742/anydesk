import type { Router } from 'express';
import { pack15Route } from '../common/pack15Route.js';
import { requireMobileCompanionAccess } from '../common/mobileCompanionAuth.js';
import type { TrustedNetworkRecordService } from './trustedNetworksService.js';
export function registerTrustedNetworkRecordRoutes(router: Router, service: TrustedNetworkRecordService): void { router.get('/pack15/trustedNetworks', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack15/trustedNetworks', requireMobileCompanionAccess, pack15Route(async (req, res) => { const data = await service.create(req.body); res.status(201).json({ data }); })); }
