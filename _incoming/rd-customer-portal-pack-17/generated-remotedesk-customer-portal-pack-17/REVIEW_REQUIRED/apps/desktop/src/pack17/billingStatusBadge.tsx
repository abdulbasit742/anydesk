import React from "react";

export function BillingStatusBadge(props: { status: "active" | "trialing" | "past_due" | "cancelled" }): JSX.Element {
  return <span data-billing-status={props.status}>Billing: {props.status}</span>;
}
