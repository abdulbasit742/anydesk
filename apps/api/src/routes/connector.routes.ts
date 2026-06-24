import { Router } from "express";
import { z } from "zod";
import {
  getConnectorCatalogForUser,
  installConnector,
  listConnectorAuditEvents,
  uninstallConnector
} from "../lib/connectorCatalog.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.use(requireAuth);

const connectorKeyParams = z.object({
  key: z.string().min(2).max(50)
});

router.get("/catalog", asyncHandler<AuthedRequest>(async (req, res) => {
  const data = await getConnectorCatalogForUser(req.user!.id);
  res.json({ success: true, data });
}));

router.post("/:key/install", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = connectorKeyParams.safeParse(req.params);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const data = await installConnector(req.user!.id, input.data.key);
    res.status(201).json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to install connector";
    const status = message.includes("not found") ? 404 : message.includes("not available") ? 409 : 400;
    res.status(status).json({ success: false, message });
  }
}));

router.delete("/:key/install", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = connectorKeyParams.safeParse(req.params);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const data = await uninstallConnector(req.user!.id, input.data.key);
    res.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to uninstall connector";
    const status = message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message });
  }
}));

router.get("/audit", asyncHandler<AuthedRequest>(async (req, res) => {
  const data = await listConnectorAuditEvents(req.user!.id);
  res.json({ success: true, data });
}));

export default router;
