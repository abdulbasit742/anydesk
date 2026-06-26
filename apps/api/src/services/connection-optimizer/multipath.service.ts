import { prisma } from "../../lib/prisma.js";

export interface NetworkPath {
  id: string;
  type: "wifi" | "ethernet" | "mobile" | "vpn";
  interfaceName: string;
  latency: number;
  bandwidth: number;
  packetLoss: number;
  isActive: boolean;
  isPrimary: boolean;
}

export const multipathService = {
  // Record network path metrics
  async recordPathMetrics(sessionId: string, paths: NetworkPath[]) {
    const records = [];
    for (const path of paths) {
      const record = await prisma.networkPathMetric.create({
        data: {
          sessionId,
          pathType: path.type,
          interfaceName: path.interfaceName,
          latency: path.latency,
          bandwidth: path.bandwidth,
          packetLoss: path.packetLoss,
          isActive: path.isActive,
          isPrimary: path.isPrimary,
        },
      });
      records.push(record);
    }
    return records;
  },

  // Determine optimal traffic distribution across paths
  calculateTrafficDistribution(paths: NetworkPath[]): Array<{
    pathId: string;
    trafficType: "input" | "video" | "file_transfer" | "all";
    percentage: number;
  }> {
    const activePaths = paths.filter((p) => p.isActive);
    if (activePaths.length === 0) return [];
    if (activePaths.length === 1) {
      return [{ pathId: activePaths[0].id, trafficType: "all", percentage: 100 }];
    }

    // Sort by latency for input traffic (mouse/keyboard needs lowest latency)
    const byLatency = [...activePaths].sort((a, b) => a.latency - b.latency);
    
    // Sort by bandwidth for video traffic
    const byBandwidth = [...activePaths].sort((a, b) => b.bandwidth - a.bandwidth);

    const distribution: Array<{
      pathId: string;
      trafficType: "input" | "video" | "file_transfer" | "all";
      percentage: number;
    }> = [];

    // Input traffic goes on lowest latency path
    distribution.push({
      pathId: byLatency[0].id,
      trafficType: "input",
      percentage: 100,
    });

    // Video traffic distributed by bandwidth ratio
    const totalBandwidth = activePaths.reduce((sum, p) => sum + p.bandwidth, 0);
    for (const path of byBandwidth) {
      distribution.push({
        pathId: path.id,
        trafficType: "video",
        percentage: Math.round((path.bandwidth / totalBandwidth) * 100),
      });
    }

    // File transfers on highest bandwidth path
    distribution.push({
      pathId: byBandwidth[0].id,
      trafficType: "file_transfer",
      percentage: 100,
    });

    return distribution;
  },

  // Detect failover need
  detectFailover(paths: NetworkPath[]): {
    needsFailover: boolean;
    failedPath?: string;
    fallbackPath?: string;
    reason?: string;
  } {
    const primaryPath = paths.find((p) => p.isPrimary);
    if (!primaryPath) return { needsFailover: false };

    // Check if primary path is failing
    const isFailingLatency = primaryPath.latency > 500;
    const isFailingPacketLoss = primaryPath.packetLoss > 20;
    const isInactive = !primaryPath.isActive;

    if (!isFailingLatency && !isFailingPacketLoss && !isInactive) {
      return { needsFailover: false };
    }

    // Find best alternative
    const alternatives = paths
      .filter((p) => p.id !== primaryPath.id && p.isActive)
      .sort((a, b) => {
        // Score based on latency and bandwidth
        const scoreA = a.bandwidth / (a.latency + 1);
        const scoreB = b.bandwidth / (b.latency + 1);
        return scoreB - scoreA;
      });

    if (alternatives.length === 0) {
      return { needsFailover: true, failedPath: primaryPath.id, reason: "No alternatives available" };
    }

    let reason = "";
    if (isInactive) reason = "Primary path disconnected";
    else if (isFailingLatency) reason = `High latency on primary (${primaryPath.latency}ms)`;
    else if (isFailingPacketLoss) reason = `High packet loss on primary (${primaryPath.packetLoss}%)`;

    return {
      needsFailover: true,
      failedPath: primaryPath.id,
      fallbackPath: alternatives[0].id,
      reason,
    };
  },

  // Calculate bonded bandwidth
  calculateBondedBandwidth(paths: NetworkPath[]): {
    totalBandwidth: number;
    effectiveBandwidth: number;
    paths: Array<{ type: string; bandwidth: number; contribution: number }>;
  } {
    const activePaths = paths.filter((p) => p.isActive);
    const totalBandwidth = activePaths.reduce((sum, p) => sum + p.bandwidth, 0);

    // Effective bandwidth accounts for overhead of multi-path (typically 85-95% efficient)
    const efficiency = activePaths.length > 1 ? 0.9 : 1.0;
    const effectiveBandwidth = totalBandwidth * efficiency;

    return {
      totalBandwidth,
      effectiveBandwidth,
      paths: activePaths.map((p) => ({
        type: p.type,
        bandwidth: p.bandwidth,
        contribution: totalBandwidth > 0 ? (p.bandwidth / totalBandwidth) * 100 : 0,
      })),
    };
  },

  // Get path history for a session
  async getPathHistory(sessionId: string) {
    return prisma.networkPathMetric.findMany({
      where: { sessionId },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  },
};
