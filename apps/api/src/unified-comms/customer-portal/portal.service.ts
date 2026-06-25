/**
 * Customer Portal Service
 * Self-service portal for customers to manage tickets, devices, and account
 */

import { randomUUID } from 'node:crypto';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  avatar: string | null;
  devices: CustomerDevice[];
  ticketCount: number;
  sessionCount: number;
  satisfactionScore: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface CustomerDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'tablet' | 'server';
  os: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeenAt: string;
  ipAddress: string | null;
}

export interface Invoice {
  id: string;
  customerId: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt: string | null;
  items: InvoiceItem[];
  downloadUrl: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PortalSettings {
  id: string;
  organizationId: string;
  enabled: boolean;
  allowTicketCreation: boolean;
  allowDeviceView: boolean;
  allowRecordingDownload: boolean;
  allowInvoiceView: boolean;
  customDomain: string | null;
  branding: {
    logo: string | null;
    primaryColor: string;
    companyName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const customers = new Map<string, CustomerProfile>();
const invoices = new Map<string, Invoice>();
const portalSettings = new Map<string, PortalSettings>();

// Sample customers
const sampleCustomers: CustomerProfile[] = [
  {
    id: 'cust-1', name: 'John Smith', email: 'john@acme.com', phone: '+1-555-0101', company: 'Acme Corp',
    avatar: null, devices: [
      { id: 'dev-1', name: 'John\'s Workstation', type: 'desktop', os: 'Windows 11', status: 'online', lastSeenAt: new Date().toISOString(), ipAddress: '192.168.1.100' },
      { id: 'dev-2', name: 'John\'s Laptop', type: 'laptop', os: 'macOS 14', status: 'offline', lastSeenAt: new Date(Date.now() - 3600000).toISOString(), ipAddress: null },
    ],
    ticketCount: 12, sessionCount: 8, satisfactionScore: 4.5, createdAt: new Date().toISOString(), lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'cust-2', name: 'Jane Doe', email: 'jane@startup.io', phone: '+1-555-0102', company: 'Startup Inc',
    avatar: null, devices: [
      { id: 'dev-3', name: 'Dev Machine', type: 'desktop', os: 'Ubuntu 22.04', status: 'online', lastSeenAt: new Date().toISOString(), ipAddress: '10.0.0.50' },
    ],
    ticketCount: 5, sessionCount: 3, satisfactionScore: 4.8, createdAt: new Date().toISOString(), lastActiveAt: new Date().toISOString(),
  },
];
sampleCustomers.forEach(c => customers.set(c.id, c));

// Sample invoices
const sampleInvoices: Invoice[] = [
  { id: 'inv-1', customerId: 'cust-1', number: 'INV-2024-001', amount: 29.00, currency: 'USD', status: 'paid', dueDate: '2024-02-01', paidAt: '2024-01-28', items: [{ description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 29.00, total: 29.00 }], downloadUrl: '/invoices/INV-2024-001.pdf', createdAt: new Date().toISOString() },
  { id: 'inv-2', customerId: 'cust-1', number: 'INV-2024-002', amount: 29.00, currency: 'USD', status: 'pending', dueDate: '2024-03-01', paidAt: null, items: [{ description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 29.00, total: 29.00 }], downloadUrl: '/invoices/INV-2024-002.pdf', createdAt: new Date().toISOString() },
];
sampleInvoices.forEach(i => invoices.set(i.id, i));

// Default portal settings
const defaultPortalSettings: PortalSettings = {
  id: 'portal-default',
  organizationId: 'org-default',
  enabled: true,
  allowTicketCreation: true,
  allowDeviceView: true,
  allowRecordingDownload: true,
  allowInvoiceView: true,
  customDomain: null,
  branding: { logo: null, primaryColor: '#2563eb', companyName: 'RemoteDesk' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
portalSettings.set(defaultPortalSettings.id, defaultPortalSettings);

export class CustomerPortalService {
  async getCustomer(id: string): Promise<CustomerProfile | null> {
    return customers.get(id) || null;
  }

  async getCustomerByEmail(email: string): Promise<CustomerProfile | null> {
    return Array.from(customers.values()).find(c => c.email === email) || null;
  }

  async listCustomers(): Promise<CustomerProfile[]> {
    return Array.from(customers.values());
  }

  async getCustomerDevices(customerId: string): Promise<CustomerDevice[]> {
    const customer = customers.get(customerId);
    return customer?.devices || [];
  }

  async getInvoices(customerId: string): Promise<Invoice[]> {
    return Array.from(invoices.values()).filter(i => i.customerId === customerId);
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    return invoices.get(id) || null;
  }

  async getPortalSettings(): Promise<PortalSettings> {
    return portalSettings.get('portal-default') || defaultPortalSettings;
  }

  async updatePortalSettings(data: Partial<PortalSettings>): Promise<PortalSettings> {
    const settings = portalSettings.get('portal-default') || defaultPortalSettings;
    if (data.enabled !== undefined) settings.enabled = data.enabled;
    if (data.allowTicketCreation !== undefined) settings.allowTicketCreation = data.allowTicketCreation;
    if (data.allowDeviceView !== undefined) settings.allowDeviceView = data.allowDeviceView;
    if (data.allowRecordingDownload !== undefined) settings.allowRecordingDownload = data.allowRecordingDownload;
    if (data.allowInvoiceView !== undefined) settings.allowInvoiceView = data.allowInvoiceView;
    if (data.customDomain !== undefined) settings.customDomain = data.customDomain;
    if (data.branding) settings.branding = { ...settings.branding, ...data.branding };
    settings.updatedAt = new Date().toISOString();
    portalSettings.set('portal-default', settings);
    return settings;
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) return { success: false, message: 'Email not found' };
    return { success: true, message: 'Password reset link sent to your email' };
  }
}

export const customerPortalService = new CustomerPortalService();
