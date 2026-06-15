import { deviceAdminActionLabel } from "@remotedesk/shared";
import { prisma } from "./prisma.js";

export async function listDeviceAdminAudit(input: { deviceId: string; limit?: number }) {
  const take = Math.min(Math.max(input.limit ?? 50, 1), 100);

  return prisma.deviceAuditEvent.findMany({
    where: { deviceId: input.deviceId },
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take
  });
}

export function serializeDeviceAuditEvent(event: {
  id: string;
  deviceId: string;
  actorUserId: string | null;
  type: string;
  message: string;
  metadata: unknown;
  createdAt: Date;
  actor?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
}) {
  return {
    id: event.id,
    deviceId: event.deviceId,
    actorUserId: event.actorUserId,
    action: event.type,
    actionLabel: deviceAdminActionLabel(event.type),
    message: event.message,
    metadata: event.metadata,
    createdAt: event.createdAt,
    actor: event.actor
      ? {
          id: event.actor.id,
          email: event.actor.email,
          fullName: event.actor.fullName
        }
      : null
  };
}
