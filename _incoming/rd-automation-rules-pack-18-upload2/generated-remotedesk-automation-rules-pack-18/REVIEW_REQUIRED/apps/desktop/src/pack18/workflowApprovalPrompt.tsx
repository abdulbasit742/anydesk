import React from "react";

export function WorkflowApprovalPrompt(props: { title: string; onApprove: () => void; onReject: () => void }): JSX.Element {
  return (
    <section role="dialog" aria-label="Workflow approval">
      <h3>{props.title}</h3>
      <button type="button" onClick={props.onApprove}>Approve</button>
      <button type="button" onClick={props.onReject}>Reject</button>
    </section>
  );
}
