import {
  defaultConnectorCatalog,
  isConnectorInstallable,
  isSafeConnectorKey,
  type ConnectorCatalogItem,
  type ConnectorDefinitionDto
} from "@remotedesk/shared/connectors";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

type PersistedConnectorDefinition = {
  key: string;
  name: string;
  category: string;
  availability: string;
  description: string;
  capabilities: Prisma.JsonValue;
  docsUrl: string | null;
};

const connectorSelect = {
  key: true,
  name: true,
  category: true,
  availability: true,
  description: true,
  capabilities: true,
  docsUrl: true
} satisfies Prisma.ConnectorDefinitionSelect;

function toCapabilities(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toConnectorDefinitionDto(definition: PersistedConnectorDefinition): ConnectorDefinitionDto {
  return {
    key: definition.key,
    name: definition.name,
    category: definition.category as ConnectorDefinitionDto["category"],
    availability: definition.availability as ConnectorDefinitionDto["availability"],
    description: definition.description,
    capabilities: toCapabilities(definition.capabilities),
    docsUrl: definition.docsUrl ?? undefined
  };
}

export async function ensureDefaultConnectorCatalog() {
  await Promise.all(
    defaultConnectorCatalog.map((connector) =>
      prisma.connectorDefinition.upsert({
        where: { key: connector.key },
        update: {
          name: connector.name,
          category: connector.category,
          availability: connector.availability,
          description: connector.description,
          capabilities: connector.capabilities,
          docsUrl: connector.docsUrl ?? null
        },
        create: {
          key: connector.key,
          name: connector.name,
          category: connector.category,
          availability: connector.availability,
          description: connector.description,
          capabilities: connector.capabilities,
          docsUrl: connector.docsUrl ?? null
        }
      })
    )
  );
}

export async function getConnectorCatalogForUser(userId: string): Promise<ConnectorCatalogItem[]> {
  await ensureDefaultConnectorCatalog();

  const [definitions, installations] = await Promise.all([
    prisma.connectorDefinition.findMany({
      select: connectorSelect,
      orderBy: [{ category: "asc" }, { name: "asc" }]
    }),
    prisma.connectorInstallation.findMany({
      where: { userId },
      select: {
        connectorKey: true,
        status: true,
        installedAt: true
      }
    })
  ]);

  const byKey = new Map(installations.map((item) => [item.connectorKey, item]));

  return definitions.map((definition) => {
    const dto = toConnectorDefinitionDto(definition);
    const installation = byKey.get(definition.key);
    const installed = installation?.status === "installed";

    return {
      ...dto,
      installStatus: installed
        ? "installed"
        : isConnectorInstallable(dto.availability)
          ? "available"
          : "coming_soon",
      installedAt: installed ? installation.installedAt.toISOString() : null
    };
  });
}

export async function installConnector(userId: string, connectorKey: string): Promise<ConnectorCatalogItem> {
  if (!isSafeConnectorKey(connectorKey)) {
    throw new Error("Invalid connector key");
  }

  await ensureDefaultConnectorCatalog();

  const connector = await prisma.connectorDefinition.findUnique({
    where: { key: connectorKey },
    select: connectorSelect
  });

  if (!connector) {
    throw new Error("Connector not found");
  }

  const dto = toConnectorDefinitionDto(connector);
  if (!isConnectorInstallable(dto.availability)) {
    throw new Error("Connector is not available yet");
  }

  const installation = await prisma.connectorInstallation.upsert({
    where: {
      connectorKey_userId: {
        connectorKey,
        userId
      }
    },
    update: {
      status: "installed",
      installedAt: new Date(),
      uninstalledAt: null
    },
    create: {
      connectorKey,
      userId,
      status: "installed"
    }
  });

  await writeConnectorAuditEvent({
    connectorKey,
    userId,
    type: "connector.installed",
    message: `${dto.name} connector installed`
  });

  return {
    ...dto,
    installStatus: "installed",
    installedAt: installation.installedAt.toISOString()
  };
}

export async function uninstallConnector(userId: string, connectorKey: string): Promise<ConnectorCatalogItem> {
  if (!isSafeConnectorKey(connectorKey)) {
    throw new Error("Invalid connector key");
  }

  await ensureDefaultConnectorCatalog();

  const connector = await prisma.connectorDefinition.findUnique({
    where: { key: connectorKey },
    select: connectorSelect
  });

  if (!connector) {
    throw new Error("Connector not found");
  }

  const dto = toConnectorDefinitionDto(connector);

  await prisma.connectorInstallation.upsert({
    where: {
      connectorKey_userId: {
        connectorKey,
        userId
      }
    },
    update: {
      status: "uninstalled",
      uninstalledAt: new Date()
    },
    create: {
      connectorKey,
      userId,
      status: "uninstalled",
      uninstalledAt: new Date()
    }
  });

  await writeConnectorAuditEvent({
    connectorKey,
    userId,
    type: "connector.uninstalled",
    message: `${dto.name} connector uninstalled`
  });

  return {
    ...dto,
    installStatus: isConnectorInstallable(dto.availability) ? "available" : "coming_soon",
    installedAt: null
  };
}

export async function listConnectorAuditEvents(userId: string) {
  return prisma.connectorAuditEvent.findMany({
    where: { userId },
    include: {
      connector: {
        select: {
          key: true,
          name: true,
          category: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function writeConnectorAuditEvent(input: {
  connectorKey: string;
  userId?: string;
  type: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.connectorAuditEvent.create({
    data: {
      connectorKey: input.connectorKey,
      userId: input.userId,
      type: input.type,
      message: input.message,
      metadata: input.metadata
    }
  });
}
