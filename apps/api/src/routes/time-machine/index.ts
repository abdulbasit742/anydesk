import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { snapshotService } from "../../services/time-machine/snapshot.service.js";
import { restoreService } from "../../services/time-machine/restore.service.js";
import { changeDetectionService } from "../../services/time-machine/change-detection.service.js";
import { scheduleService } from "../../services/time-machine/schedule.service.js";

const router = Router();
router.use(requireAuth);

// ============================================================================
// SNAPSHOTS
// ============================================================================

// Create a new snapshot
router.post(
  "/snapshots",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, name, type, components, retentionDays } = req.body;
    const snapshot = await snapshotService.createSnapshot(req.user!.id, deviceId, {
      name,
      type,
      components,
      retentionDays,
    });
    res.status(201).json({ success: true, data: snapshot });
  })
);

// Complete a snapshot (called by agent)
router.post(
  "/snapshots/:snapshotId/complete",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId } = req.params;
    const { sizeBytes, compressedSize, deduplicatedSize, componentData } = req.body;
    const snapshot = await snapshotService.completeSnapshot(snapshotId, {
      sizeBytes,
      compressedSize,
      deduplicatedSize,
      componentData,
    });
    res.json({ success: true, data: snapshot });
  })
);

// Get snapshots for a device
router.get(
  "/snapshots/:deviceId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;
    const { limit, offset, type } = req.query;
    const result = await snapshotService.getSnapshots(req.user!.id, deviceId, {
      limit: parseInt(limit as string) || 50,
      offset: parseInt(offset as string) || 0,
      type: type as string,
    });
    res.json({ success: true, data: result });
  })
);

// Get snapshot details
router.get(
  "/snapshots/:snapshotId/details",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId } = req.params;
    const snapshot = await snapshotService.getSnapshotDetails(snapshotId);
    res.json({ success: true, data: snapshot });
  })
);

// Compare two snapshots
router.get(
  "/snapshots/compare",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId1, snapshotId2 } = req.query;
    const diff = await snapshotService.compareSnapshots(
      snapshotId1 as string,
      snapshotId2 as string
    );
    res.json({ success: true, data: diff });
  })
);

// Delete snapshot
router.delete(
  "/snapshots/:snapshotId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId } = req.params;
    await snapshotService.deleteSnapshot(snapshotId);
    res.json({ success: true });
  })
);

// Verify snapshot integrity
router.get(
  "/snapshots/:snapshotId/verify",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId } = req.params;
    const result = await snapshotService.verifyIntegrity(snapshotId);
    res.json({ success: true, data: result });
  })
);

// Get storage analytics
router.get(
  "/storage",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.query;
    const analytics = await snapshotService.getStorageAnalytics(
      req.user!.id,
      deviceId as string
    );
    res.json({ success: true, data: analytics });
  })
);

// ============================================================================
// RESTORE
// ============================================================================

// Create full restore
router.post(
  "/restore/full",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId, deviceId } = req.body;
    const restore = await restoreService.createFullRestore(req.user!.id, snapshotId, deviceId);
    res.status(201).json({ success: true, data: restore });
  })
);

// Create selective restore
router.post(
  "/restore/selective",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId, deviceId, components, paths } = req.body;
    const restore = await restoreService.createSelectiveRestore(
      req.user!.id,
      snapshotId,
      deviceId,
      { components, paths }
    );
    res.status(201).json({ success: true, data: restore });
  })
);

// Create cross-device clone
router.post(
  "/restore/clone",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId, sourceDeviceId, targetDeviceId, components } = req.body;
    const restore = await restoreService.createCrossDeviceClone(
      req.user!.id,
      snapshotId,
      sourceDeviceId,
      targetDeviceId,
      components
    );
    res.status(201).json({ success: true, data: restore });
  })
);

// Create bare-metal restore
router.post(
  "/restore/bare-metal",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId, targetDeviceId } = req.body;
    const restore = await restoreService.createBareMetalRestore(
      req.user!.id,
      snapshotId,
      targetDeviceId
    );
    res.status(201).json({ success: true, data: restore });
  })
);

// Approve restore
router.post(
  "/restore/:restoreId/approve",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { restoreId } = req.params;
    const restore = await restoreService.approveRestore(restoreId, req.user!.id);
    res.json({ success: true, data: restore });
  })
);

// Start restore execution
router.post(
  "/restore/:restoreId/start",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { restoreId } = req.params;
    const restore = await restoreService.startRestore(restoreId);
    res.json({ success: true, data: restore });
  })
);

// Complete restore
router.post(
  "/restore/:restoreId/complete",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { restoreId } = req.params;
    const restore = await restoreService.completeRestore(restoreId);
    res.json({ success: true, data: restore });
  })
);

// Rollback restore
router.post(
  "/restore/:restoreId/rollback",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { restoreId } = req.params;
    const restore = await restoreService.rollbackRestore(restoreId);
    res.json({ success: true, data: restore });
  })
);

// Get restore history
router.get(
  "/restore/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, limit } = req.query;
    const history = await restoreService.getRestoreHistory(
      req.user!.id,
      deviceId as string,
      parseInt(limit as string) || 50
    );
    res.json({ success: true, data: history });
  })
);

// Get pending restores
router.get(
  "/restore/pending",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const pending = await restoreService.getPendingRestores(req.user!.id);
    res.json({ success: true, data: pending });
  })
);

// ============================================================================
// CHANGE DETECTION
// ============================================================================

// Record changes (batch)
router.post(
  "/changes",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { snapshotId, deviceId, changes } = req.body;
    const results = await changeDetectionService.recordChanges(
      snapshotId,
      req.user!.id,
      deviceId,
      changes
    );
    res.status(201).json({ success: true, data: results });
  })
);

// Get changes for device
router.get(
  "/changes/:deviceId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;
    const { limit, offset, severity, category, suspiciousOnly, since } = req.query;
    const result = await changeDetectionService.getChanges(req.user!.id, deviceId, {
      limit: parseInt(limit as string) || 100,
      offset: parseInt(offset as string) || 0,
      severity: severity as string,
      category: category as string,
      suspiciousOnly: suspiciousOnly === "true",
      since: since ? new Date(since as string) : undefined,
    });
    res.json({ success: true, data: result });
  })
);

// Get change timeline
router.get(
  "/changes/:deviceId/timeline",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;
    const { days } = req.query;
    const timeline = await changeDetectionService.getChangeTimeline(
      req.user!.id,
      deviceId,
      parseInt(days as string) || 7
    );
    res.json({ success: true, data: timeline });
  })
);

// Get alerts
router.get(
  "/alerts",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, limit } = req.query;
    const alerts = await changeDetectionService.getAlerts(
      req.user!.id,
      deviceId as string,
      parseInt(limit as string) || 50
    );
    res.json({ success: true, data: alerts });
  })
);

// Get change statistics
router.get(
  "/changes/:deviceId/stats",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;
    const stats = await changeDetectionService.getChangeStats(req.user!.id, deviceId);
    res.json({ success: true, data: stats });
  })
);

// ============================================================================
// SCHEDULES
// ============================================================================

// Create schedule
router.post(
  "/schedules",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, name, cronExpression, snapshotType, components, retentionDays, maxSnapshots } =
      req.body;
    const schedule = await scheduleService.createSchedule(req.user!.id, deviceId, {
      name,
      cronExpression,
      snapshotType,
      components,
      retentionDays,
      maxSnapshots,
    });
    res.status(201).json({ success: true, data: schedule });
  })
);

// Get schedules
router.get(
  "/schedules",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.query;
    const schedules = await scheduleService.getSchedules(req.user!.id, deviceId as string);
    res.json({ success: true, data: schedules });
  })
);

// Update schedule
router.put(
  "/schedules/:scheduleId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { scheduleId } = req.params;
    const schedule = await scheduleService.updateSchedule(scheduleId, req.body);
    res.json({ success: true, data: schedule });
  })
);

// Delete schedule
router.delete(
  "/schedules/:scheduleId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { scheduleId } = req.params;
    await scheduleService.deleteSchedule(scheduleId);
    res.json({ success: true });
  })
);

// ============================================================================
// COMPLIANCE
// ============================================================================

// Generate compliance report
router.post(
  "/compliance/report",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, snapshotId, reportType } = req.body;
    const report = await scheduleService.generateComplianceReport(
      req.user!.id,
      deviceId,
      snapshotId,
      reportType
    );
    res.status(201).json({ success: true, data: report });
  })
);

// Get compliance reports
router.get(
  "/compliance/reports",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, limit } = req.query;
    const reports = await scheduleService.getComplianceReports(
      req.user!.id,
      deviceId as string,
      parseInt(limit as string) || 20
    );
    res.json({ success: true, data: reports });
  })
);

export default router;
