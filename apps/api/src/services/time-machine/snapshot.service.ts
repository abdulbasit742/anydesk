import { prisma } from "../../lib/prisma.js";
import crypto from "crypto";

export const SNAPSHOT_COMPONENTS = [
  "files",
  "registry",
  "services",
  "software",
  "network",
  "users",
  "env_vars",
  "scheduled_tasks",
  "browser",
  "desktop_layout",
] as const;

export type SnapshotComponentType = (typeof SNAPSHOT_COMPONENTS)[number];

export const snapshotService = {
  // Create a new system snapshot
  async createSnapshot(
    userId: string,
    deviceId: string,
    options: {
      name?: string;
      type?: string;
      components?: string[];
      retentionDays?: number;
    } = {}
  ) {
    const {
      name,
      type = "automatic",
      components = [...SNAPSHOT_COMPONENTS],
      retentionDays = 30,
    } = options;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);

    // Get previous snapshot hash for chain
    const previousSnapshot = await prisma.systemSnapshot.findFirst({
      where: { userId, deviceId, status: "completed" },
      orderBy: { createdAt: "desc" },
    });

    const snapshot = await prisma.systemSnapshot.create({
      data: {
        userId,
        deviceId,
        name: name || `Snapshot ${new Date().toISOString()}`,
        type,
        status: "in_progress",
        retentionDays,
        expiresAt,
        previousHash: previousSnapshot?.hashChain || null,
        metadata: {
          requestedComponents: components,
          initiatedBy: type === "automatic" ? "scheduler" : "user",
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Create component entries for each requested component
    for (const componentType of components) {
      await prisma.snapshotComponent.create({
        data: {
          snapshotId: snapshot.id,
          componentType,
          dataPath: `/snapshots/${userId}/${deviceId}/${snapshot.id}/${componentType}`,
          checksum: crypto.randomBytes(32).toString("hex"),
          metadata: { status: "pending" },
        },
      });
    }

    return snapshot;
  },

  // Complete a snapshot (called by agent after data collection)
  async completeSnapshot(
    snapshotId: string,
    data: {
      sizeBytes: number;
      compressedSize: number;
      deduplicatedSize: number;
      componentData: Record<string, { sizeBytes: number; checksum: string }>;
    }
  ) {
    // Generate hash chain
    const hashContent = `${snapshotId}:${data.sizeBytes}:${Date.now()}`;
    const hashChain = crypto.createHash("sha256").update(hashContent).digest("hex");

    const snapshot = await prisma.systemSnapshot.update({
      where: { id: snapshotId },
      data: {
        status: "completed",
        sizeBytes: BigInt(data.sizeBytes),
        compressedSize: BigInt(data.compressedSize),
        deduplicatedSize: BigInt(data.deduplicatedSize),
        hashChain,
        completedAt: new Date(),
      },
    });

    // Update component data
    for (const [componentType, componentInfo] of Object.entries(data.componentData)) {
      await prisma.snapshotComponent.updateMany({
        where: { snapshotId, componentType },
        data: {
          sizeBytes: BigInt(componentInfo.sizeBytes),
          checksum: componentInfo.checksum,
          metadata: { status: "completed" },
        },
      });
    }

    // Update storage stats
    await this.updateStorageStats(snapshot.userId, snapshot.deviceId);

    return snapshot;
  },

  // Get snapshots for a device
  async getSnapshots(
    userId: string,
    deviceId: string,
    options: { limit?: number; offset?: number; type?: string } = {}
  ) {
    const { limit = 50, offset = 0, type } = options;
    const where: any = { userId, deviceId, status: "completed" };
    if (type) where.type = type;

    const [snapshots, total] = await Promise.all([
      prisma.systemSnapshot.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          components: true,
          _count: { select: { changes: true } },
        },
      }),
      prisma.systemSnapshot.count({ where }),
    ]);

    return { snapshots, total };
  },

  // Get snapshot details
  async getSnapshotDetails(snapshotId: string) {
    return prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
      include: {
        components: true,
        changes: {
          orderBy: { detectedAt: "desc" },
          take: 100,
        },
      },
    });
  },

  // Compare two snapshots (diff)
  async compareSnapshots(snapshotId1: string, snapshotId2: string) {
    const [snapshot1, snapshot2] = await Promise.all([
      prisma.systemSnapshot.findUnique({
        where: { id: snapshotId1 },
        include: { components: true, changes: true },
      }),
      prisma.systemSnapshot.findUnique({
        where: { id: snapshotId2 },
        include: { components: true, changes: true },
      }),
    ]);

    if (!snapshot1 || !snapshot2) throw new Error("Snapshot not found");

    // Get changes between the two snapshots
    const changesBetween = await prisma.systemChange.findMany({
      where: {
        deviceId: snapshot1.deviceId,
        detectedAt: {
          gte: snapshot1.createdAt < snapshot2.createdAt ? snapshot1.createdAt : snapshot2.createdAt,
          lte: snapshot1.createdAt > snapshot2.createdAt ? snapshot1.createdAt : snapshot2.createdAt,
        },
      },
      orderBy: { detectedAt: "asc" },
    });

    // Calculate size differences
    const sizeDiff = Number(snapshot2.sizeBytes) - Number(snapshot1.sizeBytes);

    return {
      snapshot1: {
        id: snapshot1.id,
        createdAt: snapshot1.createdAt,
        sizeBytes: Number(snapshot1.sizeBytes),
        components: snapshot1.components.length,
      },
      snapshot2: {
        id: snapshot2.id,
        createdAt: snapshot2.createdAt,
        sizeBytes: Number(snapshot2.sizeBytes),
        components: snapshot2.components.length,
      },
      changesBetween,
      totalChanges: changesBetween.length,
      sizeDifference: sizeDiff,
      categorySummary: this.categorizeChanges(changesBetween),
    };
  },

  // Categorize changes for summary
  categorizeChanges(changes: any[]) {
    const summary: Record<string, { count: number; critical: number; warning: number }> = {};

    for (const change of changes) {
      if (!summary[change.category]) {
        summary[change.category] = { count: 0, critical: 0, warning: 0 };
      }
      summary[change.category].count++;
      if (change.severity === "critical") summary[change.category].critical++;
      if (change.severity === "warning") summary[change.category].warning++;
    }

    return summary;
  },

  // Delete snapshot
  async deleteSnapshot(snapshotId: string) {
    return prisma.systemSnapshot.delete({
      where: { id: snapshotId },
    });
  },

  // Update storage statistics
  async updateStorageStats(userId: string, deviceId: string) {
    const snapshots = await prisma.systemSnapshot.findMany({
      where: { userId, deviceId, status: "completed" },
      orderBy: { createdAt: "asc" },
    });

    const totalSize = snapshots.reduce((sum, s) => sum + Number(s.sizeBytes), 0);
    const deduplicatedTotal = snapshots.reduce((sum, s) => sum + Number(s.deduplicatedSize), 0);
    const compressedTotal = snapshots.reduce((sum, s) => sum + Number(s.compressedSize), 0);

    await prisma.snapshotStorage.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      create: {
        userId,
        deviceId,
        totalSizeBytes: BigInt(totalSize),
        usedSizeBytes: BigInt(deduplicatedTotal),
        deduplicationRatio: totalSize > 0 ? deduplicatedTotal / totalSize : 1,
        compressionRatio: totalSize > 0 ? compressedTotal / totalSize : 1,
        snapshotCount: snapshots.length,
        oldestSnapshot: snapshots[0]?.createdAt,
        newestSnapshot: snapshots[snapshots.length - 1]?.createdAt,
      },
      update: {
        totalSizeBytes: BigInt(totalSize),
        usedSizeBytes: BigInt(deduplicatedTotal),
        deduplicationRatio: totalSize > 0 ? deduplicatedTotal / totalSize : 1,
        compressionRatio: totalSize > 0 ? compressedTotal / totalSize : 1,
        snapshotCount: snapshots.length,
        oldestSnapshot: snapshots[0]?.createdAt,
        newestSnapshot: snapshots[snapshots.length - 1]?.createdAt,
      },
    });
  },

  // Get storage analytics
  async getStorageAnalytics(userId: string, deviceId?: string) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    const storage = await prisma.snapshotStorage.findMany({ where });

    const totalStorage = storage.reduce((sum, s) => sum + Number(s.totalSizeBytes), 0);
    const usedStorage = storage.reduce((sum, s) => sum + Number(s.usedSizeBytes), 0);
    const totalSnapshots = storage.reduce((sum, s) => sum + s.snapshotCount, 0);
    const avgDedup = storage.reduce((sum, s) => sum + s.deduplicationRatio, 0) / (storage.length || 1);
    const avgCompression = storage.reduce((sum, s) => sum + s.compressionRatio, 0) / (storage.length || 1);

    return {
      totalStorageBytes: totalStorage,
      usedStorageBytes: usedStorage,
      totalSnapshots,
      averageDeduplicationRatio: avgDedup,
      averageCompressionRatio: avgCompression,
      spaceSavedBytes: totalStorage - usedStorage,
      spaceSavedPercent: totalStorage > 0 ? ((totalStorage - usedStorage) / totalStorage) * 100 : 0,
      devices: storage,
    };
  },

  // Verify snapshot integrity (hash chain)
  async verifyIntegrity(snapshotId: string) {
    const snapshot = await prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) throw new Error("Snapshot not found");
    if (!snapshot.hashChain) return { verified: false, error: "No hash chain" };

    // Verify previous hash link
    if (snapshot.previousHash) {
      const previousSnapshot = await prisma.systemSnapshot.findFirst({
        where: {
          userId: snapshot.userId,
          deviceId: snapshot.deviceId,
          hashChain: snapshot.previousHash,
        },
      });

      if (!previousSnapshot) {
        return { verified: false, error: "Hash chain broken - previous snapshot not found" };
      }
    }

    return { verified: true, hashChain: snapshot.hashChain };
  },
};
