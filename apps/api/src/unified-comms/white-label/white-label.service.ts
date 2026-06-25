/**
 * White-Label Support Portal Service
 * Custom branding, domains, and theming for organizations
 */

import { randomUUID } from 'node:crypto';

export interface WhiteLabelConfig {
  id: string;
  organizationId: string;
  organizationName: string;
  customDomain: string | null;
  branding: WhiteLabelBranding;
  emailTemplates: EmailTemplate[];
  features: WhiteLabelFeatures;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteLabelBranding {
  logo: string | null;
  logoLight: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: number;
  customCss: string | null;
  headerHtml: string | null;
  footerHtml: string | null;
  loginBackground: string | null;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
}

export interface WhiteLabelFeatures {
  hideRemoteDeskBranding: boolean;
  customLoginPage: boolean;
  customEmailDomain: boolean;
  customKnowledgeBase: boolean;
  customChatWidget: boolean;
  customPortal: boolean;
}

const configs = new Map<string, WhiteLabelConfig>();

const defaultConfig: WhiteLabelConfig = {
  id: 'wl-default',
  organizationId: 'org-default',
  organizationName: 'RemoteDesk',
  customDomain: null,
  branding: {
    logo: null,
    logoLight: null,
    favicon: null,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: 8,
    customCss: null,
    headerHtml: null,
    footerHtml: null,
    loginBackground: null,
  },
  emailTemplates: [
    { id: 'tpl-welcome', name: 'Welcome Email', subject: 'Welcome to {{company_name}}', htmlBody: '<h1>Welcome!</h1><p>Your account has been created.</p>', textBody: 'Welcome! Your account has been created.', variables: ['company_name', 'user_name', 'login_url'] },
    { id: 'tpl-ticket', name: 'New Ticket', subject: '[#{{ticket_number}}] {{ticket_subject}}', htmlBody: '<p>A new ticket has been created: {{ticket_subject}}</p>', textBody: 'A new ticket has been created: {{ticket_subject}}', variables: ['ticket_number', 'ticket_subject', 'ticket_url'] },
    { id: 'tpl-reply', name: 'Ticket Reply', subject: 'Re: [#{{ticket_number}}] {{ticket_subject}}', htmlBody: '<p>{{agent_name}} replied to your ticket:</p><p>{{reply_content}}</p>', textBody: '{{agent_name}} replied: {{reply_content}}', variables: ['ticket_number', 'ticket_subject', 'agent_name', 'reply_content'] },
  ],
  features: {
    hideRemoteDeskBranding: true,
    customLoginPage: true,
    customEmailDomain: true,
    customKnowledgeBase: true,
    customChatWidget: true,
    customPortal: true,
  },
  enabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
configs.set(defaultConfig.id, defaultConfig);

export class WhiteLabelService {
  async getConfig(organizationId?: string): Promise<WhiteLabelConfig> {
    if (organizationId) {
      const config = Array.from(configs.values()).find(c => c.organizationId === organizationId);
      if (config) return config;
    }
    return configs.get('wl-default') || defaultConfig;
  }

  async updateConfig(id: string, data: Partial<WhiteLabelConfig>): Promise<WhiteLabelConfig | null> {
    const config = configs.get(id) || configs.get('wl-default');
    if (!config) return null;
    if (data.customDomain !== undefined) config.customDomain = data.customDomain;
    if (data.organizationName) config.organizationName = data.organizationName;
    if (data.branding) config.branding = { ...config.branding, ...data.branding };
    if (data.features) config.features = { ...config.features, ...data.features };
    if (data.enabled !== undefined) config.enabled = data.enabled;
    config.updatedAt = new Date().toISOString();
    configs.set(config.id, config);
    return config;
  }

  async updateEmailTemplate(configId: string, templateId: string, data: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    const config = configs.get(configId);
    if (!config) return null;
    const template = config.emailTemplates.find(t => t.id === templateId);
    if (!template) return null;
    Object.assign(template, data);
    config.updatedAt = new Date().toISOString();
    configs.set(configId, config);
    return template;
  }

  async verifyDomain(domain: string): Promise<{ verified: boolean; dnsRecords: { type: string; name: string; value: string; status: string }[] }> {
    return {
      verified: false,
      dnsRecords: [
        { type: 'CNAME', name: domain, value: 'portal.remotedesk.io', status: 'pending' },
        { type: 'TXT', name: `_verify.${domain}`, value: `remotedesk-verify=${randomUUID()}`, status: 'pending' },
      ],
    };
  }
}

export const whiteLabelService = new WhiteLabelService();
