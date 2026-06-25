/**
 * Analytics & Reporting Service
 * Support metrics, agent performance, channel breakdown, and custom reports
 */

import { randomUUID } from 'node:crypto';

export interface SupportMetrics {
  firstResponseTime: { avg: number; median: number; p95: number };
  resolutionTime: { avg: number; median: number; p95: number };
  csatScore: number;
  customerEffortScore: number;
  ticketsCreated: number;
  ticketsResolved: number;
  ticketsEscalated: number;
  aiResolutionRate: number;
  channelBreakdown: Record<string, number>;
  peakHours: { hour: number; count: number }[];
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsHandled: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  csatScore: number;
  activeConversations: number;
  resolvedToday: number;
  onlineTime: number;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'table' | 'chart' | 'summary';
  metrics: string[];
  filters: Record<string, unknown>;
  groupBy: string | null;
  dateRange: { from: string; to: string };
  schedule: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueImpact {
  supportToUpsell: number;
  retentionSaves: number;
  churnPrevented: number;
  totalRevenueSaved: number;
  upsellConversions: { ticketId: string; amount: number; product: string }[];
}

const customReports = new Map<string, CustomReport>();

export class AnalyticsService {
  async getOverview(dateFrom?: string, dateTo?: string): Promise<SupportMetrics> {
    // Simulated metrics (production would query from PostgreSQL/TimescaleDB)
    return {
      firstResponseTime: { avg: 4.2, median: 3.1, p95: 12.5 },
      resolutionTime: { avg: 18.7, median: 14.2, p95: 48.0 },
      csatScore: 4.3,
      customerEffortScore: 2.1,
      ticketsCreated: 342,
      ticketsResolved: 298,
      ticketsEscalated: 44,
      aiResolutionRate: 67.5,
      channelBreakdown: {
        live_chat: 125,
        email: 89,
        phone: 45,
        whatsapp: 38,
        telegram: 15,
        twitter: 12,
        facebook: 10,
        sms: 8,
      },
      peakHours: [
        { hour: 9, count: 45 },
        { hour: 10, count: 52 },
        { hour: 11, count: 48 },
        { hour: 14, count: 55 },
        { hour: 15, count: 50 },
        { hour: 16, count: 42 },
      ],
    };
  }

  async getAgentPerformance(): Promise<AgentPerformance[]> {
    return [
      { agentId: 'agent-1', agentName: 'Sarah Johnson', ticketsHandled: 45, avgResponseTime: 2.3, avgResolutionTime: 15.2, csatScore: 4.7, activeConversations: 3, resolvedToday: 8, onlineTime: 7.5 },
      { agentId: 'agent-2', agentName: 'Mike Chen', ticketsHandled: 38, avgResponseTime: 3.1, avgResolutionTime: 18.5, csatScore: 4.5, activeConversations: 2, resolvedToday: 6, onlineTime: 7.0 },
      { agentId: 'agent-3', agentName: 'Emily Davis', ticketsHandled: 52, avgResponseTime: 1.8, avgResolutionTime: 12.8, csatScore: 4.8, activeConversations: 4, resolvedToday: 10, onlineTime: 8.0 },
      { agentId: 'agent-4', agentName: 'Alex Kumar', ticketsHandled: 41, avgResponseTime: 2.7, avgResolutionTime: 16.3, csatScore: 4.4, activeConversations: 2, resolvedToday: 7, onlineTime: 6.5 },
      { agentId: 'agent-5', agentName: 'Lisa Park', ticketsHandled: 35, avgResponseTime: 3.5, avgResolutionTime: 20.1, csatScore: 4.2, activeConversations: 1, resolvedToday: 5, onlineTime: 6.0 },
    ];
  }

  async getRevenueImpact(): Promise<RevenueImpact> {
    return {
      supportToUpsell: 23,
      retentionSaves: 15,
      churnPrevented: 8,
      totalRevenueSaved: 45200,
      upsellConversions: [
        { ticketId: 'ticket-1', amount: 2400, product: 'Enterprise Plan' },
        { ticketId: 'ticket-2', amount: 1200, product: 'Professional Plan' },
        { ticketId: 'ticket-3', amount: 3600, product: 'Enterprise Plan + Add-ons' },
      ],
    };
  }

  async getChannelMetrics(): Promise<Record<string, { volume: number; avgResponseTime: number; csatScore: number; resolutionRate: number }>> {
    return {
      live_chat: { volume: 125, avgResponseTime: 0.5, csatScore: 4.5, resolutionRate: 82 },
      email: { volume: 89, avgResponseTime: 4.2, csatScore: 4.1, resolutionRate: 75 },
      phone: { volume: 45, avgResponseTime: 0.3, csatScore: 4.6, resolutionRate: 88 },
      whatsapp: { volume: 38, avgResponseTime: 1.2, csatScore: 4.4, resolutionRate: 80 },
      telegram: { volume: 15, avgResponseTime: 1.5, csatScore: 4.3, resolutionRate: 78 },
      twitter: { volume: 12, avgResponseTime: 2.1, csatScore: 4.0, resolutionRate: 70 },
      facebook: { volume: 10, avgResponseTime: 2.5, csatScore: 4.1, resolutionRate: 72 },
      sms: { volume: 8, avgResponseTime: 3.0, csatScore: 4.2, resolutionRate: 76 },
    };
  }

  async getSLAMetrics(): Promise<{ compliance: number; breached: number; atRisk: number; byPriority: Record<string, { total: number; met: number; breached: number }> }> {
    return {
      compliance: 92.5,
      breached: 12,
      atRisk: 8,
      byPriority: {
        critical: { total: 15, met: 13, breached: 2 },
        high: { total: 45, met: 40, breached: 5 },
        medium: { total: 120, met: 115, breached: 5 },
        low: { total: 80, met: 80, breached: 0 },
      },
    };
  }

  // Custom Reports
  async createReport(data: Omit<CustomReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomReport> {
    const report: CustomReport = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customReports.set(report.id, report);
    return report;
  }

  async getReports(): Promise<CustomReport[]> {
    return Array.from(customReports.values());
  }

  async getReport(id: string): Promise<CustomReport | null> {
    return customReports.get(id) || null;
  }

  async updateReport(id: string, data: Partial<CustomReport>): Promise<CustomReport | null> {
    const report = customReports.get(id);
    if (!report) return null;
    Object.assign(report, data, { updatedAt: new Date().toISOString() });
    customReports.set(id, report);
    return report;
  }

  async deleteReport(id: string): Promise<boolean> {
    return customReports.delete(id);
  }

  async getRealTimeMetrics(): Promise<{ activeConversations: number; queueSize: number; avgWaitTime: number; onlineAgents: number; busyAgents: number }> {
    return {
      activeConversations: 12,
      queueSize: 5,
      avgWaitTime: 2.3,
      onlineAgents: 8,
      busyAgents: 5,
    };
  }
}

export const analyticsService = new AnalyticsService();
