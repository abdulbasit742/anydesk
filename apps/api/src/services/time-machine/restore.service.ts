import { prisma } from "../../lib/prisma.js";

export const restoreService = {
  // Create a full restore request
  async createFullRestore(userId: string, snapshotId: string, deviceId: string) {
    const snapshot = await prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
      include: { components: true },
    });

    if (!snapshot) throw new Error("Snapshot not found");
    if (snapshot.status !== "completed") throw new Error("Snapshot is not complete");

    const targetComponents = snapshot.components.map((c) => c.componentType);

    return prisma.restorePoint.create({
      data: {
        snapshotId,
        userId,
        deviceId,
        restoreType: "full",
        targetComponents,
        status: "pending",
      },
    });
  },

  // Create a selective restore request
  async createSelectiveRestore(
    userId: string,
    snapshotId: string,
    deviceId: string,
    options: {
      components?: string[];
      paths?: string[];
    }
  ) {
    const snapshot = await prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) throw new Error("Snapshot not found");
    if (snapshot.status !== "completed") throw new Error("Snapshot is not complete");

    return prisma.restorePoint.create({
      data: {
        snapshotId,
        userId,
        deviceId,
        restoreType: "selective",
        targetComponents: options.components || [],
        targetPaths: options.paths || [],
        status: "pending",
      },
    });
  },

  // Create cross-device clone
  async createCrossDeviceClone(
    userId: string,
    snapshotId: string,
    sourceDeviceId: string,
    targetDeviceId: string,
    components?: string[]
  ) {
    const snapshot = await prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
      include: { components: true },
    });

    if (!snapshot) throw new Error("Snapshot not found");
    if (snapshot.deviceId !== sourceDeviceId) throw new Error("Snapshot does not belong to source device");

    const targetComponents = components || snapshot.components.map((c) => c.componentType);

    return prisma.restorePoint.create({
      data: {
        snapshotId,
        userId,
        deviceId: sourceDeviceId,
        targetDeviceId,
        restoreType: "cross_device",
        targetComponents,
        status: "pending",
      },
    });
  },

  // Create bare-metal restore
  async createBareMetalRestore(userId: string, snapshotId: string, targetDeviceId: string) {
    return prisma.restorePoint.create({
      data: {
        snapshotId,
        userId,
        deviceId: targetDeviceId,
        restoreType: "bare_metal",
        targetComponents: ["files", "registry", "services", "software", "network", "users", "env_vars", "scheduled_tasks"],
        status: "pending",
      },
    });
  },

  // Approve restore request
  async approveRestore(restoreId: string, approvedBy: string) {
    return prisma.restorePoint.update({
      where: { id: restoreId },
      data: {
        status: "approved",
        approvedBy,
        approvedAt: new Date(),
      },
    });
  },

  // Start restore execution
  async startRestore(restoreId: string) {
    return prisma.restorePoint.update({
      where: { id: restoreId },
      data: {
        status: "in_progress",
        startedAt: new Date(),
      },
    });
  },

  // Complete restore
  async completeRestore(restoreId: string) {
    return prisma.restorePoint.update({
      where: { id: restoreId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
  },

  // Fail restore
  async failRestore(restoreId: string, errorMessage: string) {
    return prisma.restorePoint.update({
      where: { id: restoreId },
      data: {
        status: "failed",
        errorMessage,
        completedAt: new Date(),
      },
    });
  },

  // Rollback a restore (undo the restore)
  async rollbackRestore(restoreId: string) {
    const restore = await prisma.restorePoint.findUnique({
      where: { id: restoreId },
    });

    if (!restore) throw new Error("Restore point not found");
    if (!restore.rollbackAvailable) throw new Error("Rollback not available");
    if (restore.status !== "completed") throw new Error("Can only rollback completed restores");

    return prisma.restorePoint.update({
      where: { id: restoreId },
      data: {
        status: "rolled_back",
        rollbackAvailable: false,
      },
    });
  },

  // Get restore history
  async getRestoreHistory(userId: string, deviceId?: string, limit: number = 50) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.restorePoint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        snapshot: {
          select: { id: true, name: true, createdAt: true, type: true },
        },
      },
    });
  },

  // Get pending restores
  async getPendingRestores(userId: string) {
    return prisma.restorePoint.findMany({
      where: { userId, status: { in: ["pending", "approved"] } },
      include: {
        snapshot: {
          select: { id: true, name: true, createdAt: true, deviceId: true },
        },
      },
    });
  },
};
