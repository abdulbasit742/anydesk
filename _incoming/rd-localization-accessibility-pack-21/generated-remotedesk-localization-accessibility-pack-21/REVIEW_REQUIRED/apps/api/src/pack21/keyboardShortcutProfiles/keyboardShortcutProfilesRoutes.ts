import type { Router } from "express";
import { pack21Route } from "../common/pack21Route.js";
import { requireExperienceAdmin } from "../common/experienceAdminAuth.js";
import type { KeyboardShortcutProfileRecordService } from "./keyboardShortcutProfilesService.js";

export function registerKeyboardShortcutProfileRecordRoutes(router: Router, service: KeyboardShortcutProfileRecordService): void {
  router.get("/pack21/keyboardShortcutProfiles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.list(req.query as Record<string, unknown>, Number(req.query.limit ?? 50));
    res.json({ data });
  }));

  router.post("/pack21/keyboardShortcutProfiles", requireExperienceAdmin, pack21Route(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }));
}
