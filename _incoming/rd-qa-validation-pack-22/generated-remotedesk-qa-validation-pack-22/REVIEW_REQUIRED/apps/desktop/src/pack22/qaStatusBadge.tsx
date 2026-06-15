import React from "react";

export function QaStatusBadge(props: { failed: number; blocked: number; flaky: number }): JSX.Element {
  return <span data-qa-status={props.failed || props.blocked ? "blocked" : "ok"}>QA: {props.failed} failed · {props.blocked} blocked · {props.flaky} flaky</span>;
}
