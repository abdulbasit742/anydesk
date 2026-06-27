import { prisma } from "../../lib/prisma.js";
export const refundService = {
  async requestRefund(userId: string, invoiceId: string, reason: string, amount?: number) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.userId !== userId) throw new Error("Invoice not found");
    if (invoice.status !== "paid") throw new Error("Can only refund paid invoices");
    const refundAmount = amount || invoice.total;
    return prisma.refund.create({ data: { userId, invoiceId, amount: refundAmount, reason, status: "pending" } });
  },
  async approveRefund(refundId: string, adminId: string) {
    return prisma.refund.update({ where: { id: refundId }, data: { status: "approved", approvedBy: adminId, approvedAt: new Date() } });
  },
  async processRefund(refundId: string) {
    const refund = await prisma.refund.findUnique({ where: { id: refundId } });
    if (!refund || refund.status !== "approved") throw new Error("Refund not approved");
    // Process via Stripe
    return prisma.refund.update({ where: { id: refundId }, data: { status: "processed", processedAt: new Date() } });
  },
  async getRefundHistory(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    return prisma.refund.findMany({ where, orderBy: { createdAt: "desc" }, include: { invoice: true } });
  },
};
