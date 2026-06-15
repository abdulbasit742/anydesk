import type { Router } from 'express';
import { pack20Route } from '../common/pack20Route.js';
import { requireReleaseAdmin } from '../common/releaseAdminAuth.js';
import type { InstallerArtifactRecordService } from './installerArtifactsService.js';
export function registerInstallerArtifactRecordRoutes(router:Router, service:InstallerArtifactRecordService): void { router.get('/pack20/installerArtifacts', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50)); res.json({ data }); })); router.post('/pack20/installerArtifacts', requireReleaseAdmin, pack20Route(async (req,res)=>{ const data=await service.create(req.body); res.status(201).json({ data }); })); }
