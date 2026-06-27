import { prisma } from "../../lib/prisma.js";
export const invoiceService = {
  async generateInvoice(userId: string, subscriptionId: string, items: Array<{ description: string; quantity: number; unitPrice: number }>) {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxRate = 0.0; // Will be calculated based on user location
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    return prisma.invoice.create({ data: { userId, subscriptionId, invoiceNumber, items: JSON.stringify(items), subtotal, taxRate, tax, total, status: "pending", dueDate: new Date(Date.now() + 30 * 86400000) } });
  },
  async markAsPaid(invoiceId: string, paymentMethod: string, transactionId: string) {
    return prisma.invoice.update({ where: { id: invoiceId }, data: { status: "paid", paidAt: new Date(), paymentMethod, transactionId } });
  },
  async getInvoices(userId: string, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;
    return prisma.invoice.findMany({ where, orderBy: { createdAt: "desc" } });
  },
  async getInvoicePDF(invoiceId: string): Promise<Buffer> {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { user: true } });
    if (!invoice) throw new Error("Invoice not found");
    // Generate PDF content
    const pdfContent = `Invoice ${invoice.invoiceNumber}\nTotal: $${invoice.total.toFixed(2)}`;
    return Buffer.from(pdfContent);
  },
  async calculateVAT(country: string, amount: number): Promise<{ rate: number; amount: number }> {
    const vatRates: Record<string, number> = { DE: 0.19, FR: 0.20, GB: 0.20, IT: 0.22, ES: 0.21, NL: 0.21, BE: 0.21, AT: 0.20, SE: 0.25, DK: 0.25, FI: 0.24, IE: 0.23, PT: 0.23, PL: 0.23 };
    const rate = vatRates[country] || 0;
    return { rate, amount: amount * rate };
  },
};
