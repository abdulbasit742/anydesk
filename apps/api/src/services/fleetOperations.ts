import { prisma } from "../lib/prisma.js";
import { EventEmitter } from "events";

export type OperationType = 
  | "restart"
  | "shutdown"
  | "update"
  | "reboot"
  | "collect_diagnostics"
  | "refresh_policy"
  | "execute_script"
  | "deploy_image";

export interface FleetOperationOptions {
  operationType: OperationType;
  targetDeviceIds?: string[];
  targetGroups?: string[];
  targetTags?: string[];
  parameters?: Record<string, any>;
}

export interface OperationResult {
  deviceId: string;
  status: "success" | "failed" | "pending";
  message?: string;
  result?: any;
}

export class FleetOperationsManager extends EventEmitter {
  private operations: Map<string, FleetOperation> = new Map();

  async createOperation(
    userId: string,
    options: FleetOperationOptions
  ): Promise<string> {
    // Resolve target devices
    const targetDeviceIds = await this.resolveTargetDevices(userId, options);

    if (targetDeviceIds.length === 0) {
      throw new Error("No devices matched the specified criteria");
    }

    // Create operation in database
    const operation = await prisma.fleetOperation.create({
      data: {
        userId,
        operationType: options.operationType,
        targetDeviceIds,
        targetGroups: options.targetGroups || [],
        targetTags: options.targetTags || [],
        parameters: options.parameters || {},
        status: "pending"
      }
    });

    // Track in memory
    this.operations.set(operation.id, {
      id: operation.id,
      userId,
      operationType: options.operationType,
      targetDeviceIds,
      status: "pending",
      progress: 0,
      results: [],
      startedAt: null,
      completedAt: null
    });

    // Start processing asynchronously
    this.processOperation(operation.id).catch(error => {
      console.error(`Failed to process operation ${operation.id}:`, error);
    });

    return operation.id;
  }

  private async resolveTargetDevices(
    userId: string,
    options: FleetOperationOptions
  ): Promise<string[]> {
    const devices: Set<string> = new Set();

    // Add devices by ID
    if (options.targetDeviceIds) {
      options.targetDeviceIds.forEach(id => devices.add(id));
    }

    // Add devices by group
    if (options.targetGroups && options.targetGroups.length > 0) {
      const groupDevices = await prisma.device.findMany({
        where: {
          userId,
          // Group relationship depends on schema implementation
        },
        select: { id: true }
      });
      groupDevices.forEach(d => devices.add(d.id));
    }

    // Add devices by tag
    if (options.targetTags && options.targetTags.length > 0) {
      const taggedDevices: any = await prisma.deviceTag.findMany({
        where: {
          tag: { in: options.targetTags }
        },
        select: { deviceId: true }
      });
      taggedDevices.forEach((d: any) => devices.add(d.deviceId));
    }

    return Array.from(devices);
  }

  private async processOperation(operationId: string): Promise<void> {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    operation.status = "in-progress";
    operation.startedAt = new Date();

    await prisma.fleetOperation.update({
      where: { id: operationId },
      data: { status: "in-progress", startedAt: new Date() }
    });

    const results: OperationResult[] = [];
    const totalDevices = operation.targetDeviceIds.length;

    for (let i = 0; i < operation.targetDeviceIds.length; i++) {
      const deviceId = operation.targetDeviceIds[i];

      try {
        const result = await this.executeOperationOnDevice(
          deviceId,
          operation.operationType,
          operation.parameters
        );

        results.push({
          deviceId,
          status: "success",
          result
        });

        this.emit("progress", {
          operationId,
          progress: Math.round(((i + 1) / totalDevices) * 100)
        });
      } catch (error: any) {
        results.push({
          deviceId,
          status: "failed",
          message: error.message
        });
      }

      operation.progress = Math.round(((i + 1) / totalDevices) * 100);
    }

    // Mark operation as completed
    operation.status = "completed";
    operation.completedAt = new Date();
    operation.results = results;

    const successCount = results.filter(r => r.status === "success").length;
    const failureCount = results.filter(r => r.status === "failed").length;

    await prisma.fleetOperation.update({
      where: { id: operationId },
      data: {
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        results: results as any
      }
    });

    this.emit("completed", {
      operationId,
      successCount,
      failureCount,
      totalCount: totalDevices
    });
  }

  private async executeOperationOnDevice(
    deviceId: string,
    operationType: OperationType,
    parameters?: Record<string, any>
  ): Promise<any> {
    // This would integrate with device command queue
    // For now, return a placeholder
    return {
      deviceId,
      operationType,
      timestamp: new Date()
    };
  }

  async getOperation(operationId: string): Promise<any> {
    return prisma.fleetOperation.findUnique({
      where: { id: operationId }
    });
  }

  async listOperations(userId: string, limit: number = 50): Promise<any[]> {
    return prisma.fleetOperation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }

  async cancelOperation(operationId: string): Promise<void> {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    operation.status = "canceled";

    await prisma.fleetOperation.update({
      where: { id: operationId },
      data: { status: "canceled" }
    });

    this.emit("canceled", { operationId });
  }
}

interface FleetOperation {
  id: string;
  userId: string;
  operationType: OperationType;
  targetDeviceIds: string[];
  status: "pending" | "in-progress" | "completed" | "failed" | "canceled";
  progress: number;
  results: OperationResult[];
  startedAt: Date | null;
  completedAt: Date | null;
  parameters?: Record<string, any>;
}

export const fleetOperationsManager = new FleetOperationsManager();
