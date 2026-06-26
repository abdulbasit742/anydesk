import { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { stripeBillingService } from "../../services/stripeBilling.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Stripe webhook handler
 */
router.post("/stripe", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as Stripe.Event;
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await stripeBillingService.handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await stripeBillingService.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await stripeBillingService.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await stripeBillingService.handleInvoicePaid(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await stripeBillingService.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
