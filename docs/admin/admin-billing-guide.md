# Admin Billing Guide

## Plan Management
Admin > Billing shows all subscriptions.

### Plan Overview
- Plan distribution (Free/Starter/Pro/Enterprise)
- Monthly recurring revenue (MRR)
- Trial conversion rate
- Churn rate

### Customer Actions
**Upgrade Plan**: Change customer plan
**Extend Trial**: Add trial days
**Apply Coupon**: Add discount
**Cancel Subscription**: Initiate cancellation
**Refund**: Process refund via Stripe

### Invoices
- View all invoices
- Filter by status (Paid/Open/Past due)
- Download PDF
- Send reminder

### Reports
- Revenue by plan
- Revenue by month
- Customer lifetime value
- At-risk customers (past due)

## Stripe Integration
All billing operations sync with Stripe.
- Changes in admin reflect in Stripe
- Webhook events update admin data
- Refunds processed through Stripe
