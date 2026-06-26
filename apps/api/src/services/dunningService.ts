import { prisma } from "../lib/prisma.js";
import { stripeBillingService } from "./stripeBilling.js";

export class DunningService {
  /**
   * Handle failed payment
   */
  async handleFailedPayment(userId: string, invoiceId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) return;

    // Update subscription status to past due
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: "PAST_DUE",
      },
    });

    // Create dunning record
    await prisma.dunningRecord.create({
      data: {
        userId,
        invoiceId,
        attemptCount: 1,
        status: "pending",
        nextRetryAt: this.getNextRetryDate(1),
      },
    });

    // Send dunning email
    await this.sendDunningEmail(userId, 1);
  }

  /**
   * Retry failed payment
   */
  async retryFailedPayment(userId: string): Promise<{ success: boolean; error?: string }> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) {
      return { success: false, error: "No subscription found" };
    }

    // Get latest dunning record
    const dunningRecord = await prisma.dunningRecord.findFirst({
      where: { userId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    if (!dunningRecord) {
      return { success: false, error: "No pending dunning record" };
    }

    // TODO: Retry payment via Stripe
    // For now, just update the record
    const attemptCount = dunningRecord.attemptCount + 1;

    if (attemptCount > 3) {
      // Max retries reached, downgrade to free
      await this.downgradeToFree(userId);
      return { success: false, error: "Max retries reached" };
    }

    // Update dunning record
    await prisma.dunningRecord.update({
      where: { id: dunningRecord.id },
      data: {
        attemptCount,
        nextRetryAt: this.getNextRetryDate(attemptCount),
      },
    });

    // Send retry email
    await this.sendDunningEmail(userId, attemptCount);

    return { success: true };
  }

  /**
   * Downgrade to free plan
   */
  async downgradeToFree(userId: string): Promise<void> {
    // Update subscription
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: "CANCELED",
        plan: "FREE",
      },
    });

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE" },
    });

    // Update dunning record
    await prisma.dunningRecord.updateMany({
      where: { userId, status: "pending" },
      data: { status: "downgraded" },
    });

    // Send downgrade email
    await this.sendDowngradeEmail(userId);
  }

  /**
   * Send dunning email
   */
  private async sendDunningEmail(userId: string, attemptCount: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });

    if (!user) return;

    const subject = this.getDunningEmailSubject(attemptCount);
    const body = this.getDunningEmailBody(attemptCount, user.fullName || "");

    // TODO: Send email via SendGrid, AWS SES, etc.
    console.log(`Sending dunning email to ${user.email}: ${subject}`);
  }

  /**
   * Send downgrade email
   */
  private async sendDowngradeEmail(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });

    if (!user) return;

    const subject = "Your RemoteDesk subscription has been downgraded";
    const body = `Hi ${user.fullName},\n\nYour subscription has been downgraded to the Free plan due to failed payment attempts.\n\nPlease update your payment method to restore access to premium features.`;

    // TODO: Send email
    console.log(`Sending downgrade email to ${user.email}: ${subject}`);
  }

  /**
   * Get dunning email subject
   */
  private getDunningEmailSubject(attemptCount: number): string {
    switch (attemptCount) {
      case 1:
        return "Payment failed - Please update your payment method";
      case 2:
        return "Second payment attempt failed - Action required";
      case 3:
        return "Final notice - Your subscription will be canceled";
      default:
        return "Payment issue - Please contact support";
    }
  }

  /**
   * Get dunning email body
   */
  private getDunningEmailBody(attemptCount: number, name: string): string {
    const baseMessage = `Hi ${name},\n\nWe were unable to process your payment.`;

    switch (attemptCount) {
      case 1:
        return `${baseMessage}\n\nPlease update your payment method to continue using RemoteDesk.\n\nWe will retry the payment in 3 days.`;
      case 2:
        return `${baseMessage}\n\nThis is the second attempt. Please update your payment method immediately.\n\nWe will make a final retry in 3 days.`;
      case 3:
        return `${baseMessage}\n\nThis is your final notice. If we cannot process your payment, your subscription will be downgraded to the Free plan.`;
      default:
        return baseMessage;
    }
  }

  /**
   * Get next retry date
   */
  private getNextRetryDate(attemptCount: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Retry after 3 days
    return date;
  }

  /**
   * Process dunning retries (cron job)
   */
  async processDunningRetries(): Promise<void> {
    const now = new Date();

    const pendingRecords = await prisma.dunningRecord.findMany({
      where: {
        status: "pending",
        nextRetryAt: { lte: now },
      },
    });

    for (const record of pendingRecords) {
      await this.retryFailedPayment(record.userId);
    }
  }
}

export const dunningService = new DunningService();
