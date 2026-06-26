import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { prisma } from "../lib/prisma.js";

export class InvoiceService {
  /**
   * Generate PDF invoice
   */
  async generateInvoicePDF(invoiceId: string): Promise<Buffer> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();

    // Header
    page.drawText("INVOICE", {
      x: 50,
      y: height - 50,
      size: 24,
      color: rgb(0, 0, 0),
    });

    // Invoice details
    page.drawText(`Invoice #: ${invoice.id}`, {
      x: 50,
      y: height - 100,
      size: 12,
    });

    page.drawText(`Date: ${invoice.createdAt.toLocaleDateString()}`, {
      x: 50,
      y: height - 120,
      size: 12,
    });

    page.drawText(`Status: ${invoice.status.toUpperCase()}`, {
      x: 50,
      y: height - 140,
      size: 12,
    });

    // Bill to
    page.drawText("BILL TO:", {
      x: 50,
      y: height - 180,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(invoice.user?.name || "Customer", {
      x: 50,
      y: height - 200,
      size: 11,
    });

    page.drawText(invoice.user?.email || "", {
      x: 50,
      y: height - 220,
      size: 11,
    });

    // Amount
    page.drawText("AMOUNT DUE:", {
      x: 50,
      y: height - 300,
      size: 14,
      color: rgb(0, 0, 0),
    });

    const amount = (invoice.amount / 100).toFixed(2);
    page.drawText(`${invoice.currency.toUpperCase()} ${amount}`, {
      x: 50,
      y: height - 330,
      size: 20,
      color: rgb(0, 102, 204),
    });

    // Footer
    page.drawText("Thank you for your business!", {
      x: 50,
      y: 50,
      size: 11,
      color: rgb(128, 128, 128),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Send invoice email
   */
  async sendInvoiceEmail(invoiceId: string, recipientEmail: string): Promise<void> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, just log
    console.log(`Sending invoice ${invoiceId} to ${recipientEmail}`);
  }

  /**
   * Calculate tax
   */
  calculateTax(amount: number, country: string): { taxRate: number; taxAmount: number } {
    // EU VAT rates
    const vatRates: Record<string, number> = {
      AT: 0.19,
      BE: 0.21,
      BG: 0.2,
      HR: 0.25,
      CY: 0.19,
      CZ: 0.21,
      DK: 0.25,
      EE: 0.2,
      FI: 0.24,
      FR: 0.2,
      DE: 0.19,
      GR: 0.24,
      HU: 0.27,
      IE: 0.23,
      IT: 0.22,
      LV: 0.21,
      LT: 0.21,
      LU: 0.17,
      MT: 0.18,
      NL: 0.21,
      PL: 0.23,
      PT: 0.23,
      RO: 0.19,
      SK: 0.2,
      SI: 0.22,
      ES: 0.21,
      SE: 0.25,
    };

    const taxRate = vatRates[country] || 0;
    const taxAmount = Math.round(amount * taxRate);

    return { taxRate, taxAmount };
  }

  /**
   * Create invoice from subscription
   */
  async createSubscriptionInvoice(
    userId: string,
    stripeInvoiceId: string,
    amount: number,
    currency: string = "usd"
  ): Promise<any> {
    return prisma.invoice.create({
      data: {
        userId,
        stripeInvoiceId,
        amount,
        currency,
        status: "open",
      },
    });
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(invoiceId: string, status: string): Promise<any> {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });
  }

  /**
   * Get user invoices
   */
  async getUserInvoices(userId: string, limit: number = 50): Promise<any[]> {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get organization invoices
   */
  async getOrganizationInvoices(organizationId: string, limit: number = 50): Promise<any[]> {
    return prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const invoiceService = new InvoiceService();
