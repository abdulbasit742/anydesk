import {
  isSafeDeviceCommand,
  type SafeDeviceCommand,
  type SafeDeviceCommandType
} from "@remotedesk/shared/pack7/index.js";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

export const SAFE_DEVICE_COMMANDS: SafeDeviceCommandType[] = [
  "refresh_policy",
  "collect_diagnostics",
  "check_update",
  "sign_out"
];

export type DeviceCommandStatus = "pending" | "delivered" | "completed" | "failed" | "expired" | "canceled";

export function buildSafeDeviceCommandPreview(deviceId: string, type: SafeDeviceCommandType) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60_000).toISOString();
  const command: SafeDeviceCommand = {
    id: `${deviceId}:${type}`,
    deviceId,
    type,
    issuedAt: now.toISOString(),
    expiresAt
  };

  return {
    ...command,
    safe: isSafeDeviceCommand(command)
  };
}

export function buildSafeDeviceCommandPreviews(deviceId: string) {
  return SAFE_DEVICE_COMMANDS.map((type) => buildSafeDeviceCommandPreview(deviceId, type));
}

export async function expireOverdueDeviceCommands(deviceId: string, now = new Date()) {
  await prisma.deviceCommand.updateMany({
    where: {
      deviceId,
      status: { in: ["pending", "delivered"] },
      expiresAt: { lte: now }
    },
    data: {
      status: "expired",
      failedAt: now,
      failureReason: "Command expired before completion"
    }
  });
}

export async function writeDeviceAuditEvent(input: {
  deviceId: string;
  actorUserId?: string;
  type: string;
  message: string;
  metadata?: Prisma.InputJsonObject;
}) {
  return prisma.deviceAuditEvent.create({
    data: {
      deviceId: input.deviceId,
      actorUserId: input.actorUserId,
      type: input.type,
      message: input.message,
      metadata: input.metadata
    }
  });
}

export function serializeDeviceCommand(command: {
  id: string;
  deviceId: string;
  type: string;
  status: string;
  payload: unknown;
  result: unknown;
  issuedAt: Date;
  expiresAt: Date;
  deliveredAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...command,
    safe: SAFE_DEVICE_COMMANDS.includes(command.type as SafeDeviceCommandType)
  };
}
