/**
 * Customer Portal API Routes
 */

import { Router } from 'express';
import { customerPortalService } from './portal.service.js';

const router = Router();

// GET /api/portal/profile — Get customer profile
router.get('/profile', async (req, res) => {
  const customerId = (req as any).userId || req.query.customerId as string;
  const customer = await customerPortalService.getCustomer(customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// GET /api/portal/customers — List all customers (admin)
router.get('/customers', async (_req, res) => {
  const customers = await customerPortalService.listCustomers();
  res.json(customers);
});

// GET /api/portal/customers/:id — Get specific customer
router.get('/customers/:id', async (req, res) => {
  const customer = await customerPortalService.getCustomer(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// GET /api/portal/devices — Get customer devices
router.get('/devices', async (req, res) => {
  const customerId = (req as any).userId || req.query.customerId as string;
  const devices = await customerPortalService.getCustomerDevices(customerId);
  res.json(devices);
});

// GET /api/portal/invoices — Get customer invoices
router.get('/invoices', async (req, res) => {
  const customerId = (req as any).userId || req.query.customerId as string;
  const invoiceList = await customerPortalService.getInvoices(customerId);
  res.json(invoiceList);
});

// GET /api/portal/invoices/:id — Get specific invoice
router.get('/invoices/:id', async (req, res) => {
  const invoice = await customerPortalService.getInvoice(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

// GET /api/portal/settings — Get portal settings
router.get('/settings', async (_req, res) => {
  const settings = await customerPortalService.getPortalSettings();
  res.json(settings);
});

// PUT /api/portal/settings — Update portal settings
router.put('/settings', async (req, res) => {
  const settings = await customerPortalService.updatePortalSettings(req.body);
  res.json(settings);
});

// POST /api/portal/password-reset — Request password reset
router.post('/password-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  const result = await customerPortalService.requestPasswordReset(email);
  res.json(result);
});

export default router;
