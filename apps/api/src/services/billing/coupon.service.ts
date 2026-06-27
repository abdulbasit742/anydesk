import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const couponService = {
  async createCoupon(data: { code?: string; discountType: "percentage" | "fixed"; discountValue: number; maxUses?: number; expiresAt?: Date; applicablePlans?: string[] }) {
    const code = data.code || `RD${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    return prisma.coupon.create({ data: { code, discountType: data.discountType, discountValue: data.discountValue, maxUses: data.maxUses, expiresAt: data.expiresAt, applicablePlans: data.applicablePlans || [] } });
  },
  async validateCoupon(code: string, plan?: string): Promise<{ valid: boolean; discount?: number; reason?: string }> {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return { valid: false, reason: "Invalid coupon code" };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, reason: "Coupon expired" };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { valid: false, reason: "Coupon usage limit reached" };
    if (plan && coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(plan)) return { valid: false, reason: "Coupon not applicable to this plan" };
    return { valid: true, discount: coupon.discountValue };
  },
  async redeemCoupon(code: string, userId: string) {
    return prisma.coupon.update({ where: { code }, data: { usedCount: { increment: 1 } } });
  },
  async listCoupons(active?: boolean) {
    const where: any = {};
    if (active) where.expiresAt = { gt: new Date() };
    return prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" } });
  },
};
