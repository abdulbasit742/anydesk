import type { Router } from "express";
import { pack14Route } from "../common/pack14Route.js";
import { requireSessionCollaborationAccess } from "../common/sessionCollaborationAuth.js";
import type { SessionNoteRecordService } from "./sessionNotesService.js";

export function registerSessionNoteRecordRoutes(router: Router, service: SessionNoteRecordService): void {
  router.get("/pack14/sessionNotes", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack14/sessionNotes", requireSessionCollaborationAccess, pack14Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
