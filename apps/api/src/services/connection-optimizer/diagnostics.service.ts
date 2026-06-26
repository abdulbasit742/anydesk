import { prisma } from "../../lib/prisma.js";

export const diagnosticsService = {
  // Run a speed test
  async recordSpeedTest(
    userId: string,
    deviceId: string,
    results: {
      remoteDeviceId?: string;
      testType: string;
      downloadMbps: number;
      uploadMbps: number;
      latency: number;
      jitter: number;
      packetLoss: number;
      serverLocation?: string;
      isp?: string;
    }
  ) {
    return prisma.speedTestResult.create({
      data: {
        userId,
        deviceId,
        ...results,
      },
    });
  },

  // Get speed test history
  async getSpeedTestHistory(userId: string, deviceId?: string, limit: number = 20) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.speedTestResult.findMany({
      where,
      orderBy: { testedAt: "desc" },
      take: limit,
    });
  },

  // Start network diagnostic
  async startDiagnostic(
    userId: string,
    deviceId: string,
    diagnosticType: string,
    remoteDeviceId?: string
  ) {
    return prisma.networkDiagnostic.create({
      data: {
        userId,
        deviceId,
        remoteDeviceId,
        diagnosticType,
        status: "running",
      },
    });
  },

  // Complete diagnostic with results
  async completeDiagnostic(
    diagnosticId: string,
    results: {
      hops?: any[];
      bottleneckHop?: number;
      bottleneckReason?: string;
      rawResults?: any;
    }
  ) {
    // AI analysis of results
    const aiAnalysis = this.analyzeResults(results);
    const recommendations = this.generateRecommendations(results, aiAnalysis);

    return prisma.networkDiagnostic.update({
      where: { id: diagnosticId },
      data: {
        status: "completed",
        results: results.rawResults || {},
        hops: results.hops || [],
        bottleneckHop: results.bottleneckHop,
        bottleneckReason: results.bottleneckReason,
        aiAnalysis,
        recommendations,
        completedAt: new Date(),
      },
    });
  },

  // AI analysis of diagnostic results
  analyzeResults(results: any): string {
    const analyses: string[] = [];

    if (results.bottleneckHop) {
      if (results.bottleneckHop <= 2) {
        analyses.push("The bottleneck is in your local network (router or switch).");
      } else if (results.bottleneckHop <= 5) {
        analyses.push("The bottleneck appears to be at your ISP's infrastructure.");
      } else {
        analyses.push("The bottleneck is in the internet backbone or destination network.");
      }
    }

    if (results.bottleneckReason) {
      analyses.push(`Root cause: ${results.bottleneckReason}`);
    }

    if (results.hops && results.hops.length > 0) {
      const highLatencyHops = results.hops.filter((h: any) => h.latency > 50);
      if (highLatencyHops.length > 0) {
        analyses.push(`${highLatencyHops.length} hops have latency above 50ms.`);
      }
    }

    return analyses.join(" ") || "Network path appears healthy.";
  },

  // Generate recommendations
  generateRecommendations(results: any, analysis: string): string[] {
    const recommendations: string[] = [];

    if (analysis.includes("local network")) {
      recommendations.push("Move closer to your WiFi router or use a wired connection");
      recommendations.push("Check for WiFi interference from other devices");
      recommendations.push("Consider upgrading your router firmware");
      recommendations.push("Switch to 5GHz WiFi band for better performance");
    }

    if (analysis.includes("ISP")) {
      recommendations.push("Contact your ISP about the connectivity issue");
      recommendations.push("Try switching DNS servers (1.1.1.1 or 8.8.8.8)");
      recommendations.push("Consider using a VPN to route around ISP congestion");
      recommendations.push("Check if your ISP is throttling certain traffic");
    }

    if (analysis.includes("backbone")) {
      recommendations.push("Use a relay server closer to the remote device");
      recommendations.push("Try connecting at a different time (off-peak hours)");
      recommendations.push("Enable multi-path connection for redundancy");
    }

    if (recommendations.length === 0) {
      recommendations.push("Network is performing well, no changes needed");
    }

    return recommendations;
  },

  // Get diagnostic history
  async getDiagnosticHistory(userId: string, deviceId?: string, limit: number = 20) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.networkDiagnostic.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  // "Why is it slow?" one-click analysis
  async analyzeSlowConnection(userId: string, deviceId: string, sessionId?: string) {
    // Get recent metrics
    const recentMetrics = sessionId
      ? await prisma.connectionMetric.findMany({
          where: { sessionId },
          orderBy: { timestamp: "desc" },
          take: 10,
        })
      : [];

    // Get recent speed tests
    const recentSpeedTests = await prisma.speedTestResult.findMany({
      where: { userId, deviceId },
      orderBy: { testedAt: "desc" },
      take: 5,
    });

    // Analyze
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (recentMetrics.length > 0) {
      const avgLatency = recentMetrics.reduce((sum, m) => sum + m.latency, 0) / recentMetrics.length;
      const avgPacketLoss = recentMetrics.reduce((sum, m) => sum + m.packetLoss, 0) / recentMetrics.length;
      const avgBandwidth = recentMetrics.reduce((sum, m) => sum + m.bandwidth, 0) / recentMetrics.length;

      if (avgLatency > 100) {
        issues.push(`High latency detected (${avgLatency.toFixed(0)}ms average)`);
        suggestions.push("Enable predictive rendering to compensate for latency");
      }
      if (avgPacketLoss > 2) {
        issues.push(`Significant packet loss (${avgPacketLoss.toFixed(1)}%)`);
        suggestions.push("Enable Forward Error Correction (FEC)");
        suggestions.push("Check WiFi signal strength");
      }
      if (avgBandwidth < 5) {
        issues.push(`Low bandwidth (${avgBandwidth.toFixed(1)} Mbps)`);
        suggestions.push("Lower quality profile to reduce bandwidth needs");
        suggestions.push("Close other bandwidth-heavy applications");
      }
    }

    if (recentSpeedTests.length >= 2) {
      const latest = recentSpeedTests[0];
      const previous = recentSpeedTests[1];
      const downloadDrop = ((previous.downloadMbps - latest.downloadMbps) / previous.downloadMbps) * 100;
      if (downloadDrop > 30) {
        issues.push(`Download speed dropped ${downloadDrop.toFixed(0)}% since last test`);
        suggestions.push("Your internet connection may be congested");
      }
    }

    if (issues.length === 0) {
      issues.push("No obvious issues detected");
      suggestions.push("Connection appears to be performing normally");
    }

    return {
      issues,
      suggestions,
      metrics: recentMetrics.length > 0 ? {
        avgLatency: recentMetrics.reduce((sum, m) => sum + m.latency, 0) / recentMetrics.length,
        avgPacketLoss: recentMetrics.reduce((sum, m) => sum + m.packetLoss, 0) / recentMetrics.length,
        avgBandwidth: recentMetrics.reduce((sum, m) => sum + m.bandwidth, 0) / recentMetrics.length,
        avgFps: recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length,
      } : null,
    };
  },

  // Get connection quality history
  async getQualityHistory(userId: string, deviceId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.connectionQualityHistory.findMany({
      where: {
        userId,
        deviceId,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });
  },

  // Record daily quality summary
  async recordDailyQuality(
    userId: string,
    deviceId: string,
    data: {
      avgLatency: number;
      avgBandwidth: number;
      avgPacketLoss: number;
      avgFps: number;
      totalDataTransferred: number;
      totalSessionTime: number;
    }
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate quality score (0-100)
    let qualityScore = 100;
    if (data.avgLatency > 50) qualityScore -= Math.min(30, (data.avgLatency - 50) * 0.3);
    if (data.avgPacketLoss > 1) qualityScore -= Math.min(30, data.avgPacketLoss * 5);
    if (data.avgFps < 30) qualityScore -= Math.min(20, (30 - data.avgFps) * 1);
    if (data.avgBandwidth < 10) qualityScore -= Math.min(20, (10 - data.avgBandwidth) * 2);
    qualityScore = Math.max(0, qualityScore);

    // Identify issues
    const issues: string[] = [];
    if (data.avgLatency > 100) issues.push("high_latency");
    if (data.avgPacketLoss > 2) issues.push("packet_loss");
    if (data.avgFps < 20) issues.push("low_fps");
    if (data.avgBandwidth < 5) issues.push("low_bandwidth");

    return prisma.connectionQualityHistory.upsert({
      where: { userId_deviceId_date: { userId, deviceId, date: today } },
      create: {
        userId,
        deviceId,
        date: today,
        avgLatency: data.avgLatency,
        avgBandwidth: data.avgBandwidth,
        avgPacketLoss: data.avgPacketLoss,
        avgFps: data.avgFps,
        totalDataTransferred: BigInt(data.totalDataTransferred),
        totalSessionTime: data.totalSessionTime,
        qualityScore,
        issues,
      },
      update: {
        avgLatency: data.avgLatency,
        avgBandwidth: data.avgBandwidth,
        avgPacketLoss: data.avgPacketLoss,
        avgFps: data.avgFps,
        totalDataTransferred: BigInt(data.totalDataTransferred),
        totalSessionTime: data.totalSessionTime,
        qualityScore,
        issues,
      },
    });
  },
};
