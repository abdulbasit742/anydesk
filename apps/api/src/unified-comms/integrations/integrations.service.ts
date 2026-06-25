/**
 * Integrations Service
 * Slack, Jira, Salesforce, HubSpot, Zapier/Make webhooks, custom webhooks
 */

import { randomUUID } from 'node:crypto';

export type IntegrationType = 'slack' | 'jira' | 'salesforce' | 'hubspot' | 'zapier' | 'make' | 'custom_webhook';
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending_auth';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  config: Record<string, unknown>;
  events: string[];
  lastSyncAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  failureCount: number;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  success: boolean;
  error: string | null;
  triggeredAt: string;
}

const integrations = new Map<string, Integration>();
const webhooks = new Map<string, Webhook>();
const webhookLogs: WebhookLog[] = [];

// Default integrations (available but not connected)
const availableIntegrations: Integration[] = [
  { id: 'int-slack', type: 'slack', name: 'Slack', description: 'Send notifications and create tickets from Slack', status: 'inactive', config: {}, events: ['ticket.created', 'ticket.assigned', 'ticket.resolved'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'int-jira', type: 'jira', name: 'Jira', description: 'Sync tickets with Jira issues bidirectionally', status: 'inactive', config: {}, events: ['ticket.created', 'ticket.updated', 'ticket.resolved'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'int-salesforce', type: 'salesforce', name: 'Salesforce', description: 'Sync customer data with Salesforce CRM', status: 'inactive', config: {}, events: ['customer.created', 'customer.updated', 'ticket.resolved'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'int-hubspot', type: 'hubspot', name: 'HubSpot', description: 'CRM integration with HubSpot', status: 'inactive', config: {}, events: ['customer.created', 'ticket.created', 'ticket.resolved'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'int-zapier', type: 'zapier', name: 'Zapier', description: 'Connect to 5000+ apps via Zapier webhooks', status: 'inactive', config: {}, events: ['*'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'int-make', type: 'make', name: 'Make (Integromat)', description: 'Advanced automation with Make scenarios', status: 'inactive', config: {}, events: ['*'], lastSyncAt: null, errorMessage: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
availableIntegrations.forEach(i => integrations.set(i.id, i));

export class IntegrationsService {
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(integrations.values());
  }

  async getIntegration(id: string): Promise<Integration | null> {
    return integrations.get(id) || null;
  }

  async connectIntegration(id: string, config: Record<string, unknown>): Promise<Integration | null> {
    const integration = integrations.get(id);
    if (!integration) return null;
    integration.status = 'active';
    integration.config = config;
    integration.lastSyncAt = new Date().toISOString();
    integration.updatedAt = new Date().toISOString();
    integrations.set(id, integration);
    return integration;
  }

  async disconnectIntegration(id: string): Promise<Integration | null> {
    const integration = integrations.get(id);
    if (!integration) return null;
    integration.status = 'inactive';
    integration.config = {};
    integration.updatedAt = new Date().toISOString();
    integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, data: Partial<Integration>): Promise<Integration | null> {
    const integration = integrations.get(id);
    if (!integration) return null;
    Object.assign(integration, data, { updatedAt: new Date().toISOString() });
    integrations.set(id, integration);
    return integration;
  }

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    return Array.from(webhooks.values());
  }

  async createWebhook(data: { name: string; url: string; events: string[] }): Promise<Webhook> {
    const webhook: Webhook = {
      id: randomUUID(),
      name: data.name,
      url: data.url,
      events: data.events,
      secret: randomUUID().replace(/-/g, ''),
      enabled: true,
      lastTriggeredAt: null,
      failureCount: 0,
      createdAt: new Date().toISOString(),
    };
    webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook | null> {
    const webhook = webhooks.get(id);
    if (!webhook) return null;
    Object.assign(webhook, data);
    webhooks.set(id, webhook);
    return webhook;
  }

  async deleteWebhook(id: string): Promise<boolean> {
    return webhooks.delete(id);
  }

  async triggerWebhook(webhookId: string, event: string, payload: Record<string, unknown>): Promise<WebhookLog> {
    const webhook = webhooks.get(webhookId);
    const log: WebhookLog = {
      id: randomUUID(),
      webhookId,
      event,
      payload,
      responseStatus: 200,
      success: true,
      error: null,
      triggeredAt: new Date().toISOString(),
    };

    if (webhook) {
      webhook.lastTriggeredAt = log.triggeredAt;
      webhooks.set(webhookId, webhook);
    }

    webhookLogs.push(log);
    return log;
  }

  async getWebhookLogs(webhookId?: string, limit?: number): Promise<WebhookLog[]> {
    let results = webhookLogs;
    if (webhookId) results = results.filter(l => l.webhookId === webhookId);
    return results.slice(-(limit || 50)).reverse();
  }
}

export const integrationsService = new IntegrationsService();
