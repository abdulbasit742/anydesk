import React from "react";

export function HostConsentDialog(props: { consentType: string; requesterName: string; onAccept: () => void; onReject: () => void }): JSX.Element {
  return (
    <section role="dialog" aria-label="Host consent request">
      <h3>Permission request</h3>
      <p>{props.requesterName} requests: {props.consentType}</p>
      <button type="button" onClick={props.onAccept}>Accept</button>
      <button type="button" onClick={props.onReject}>Reject</button>
    </section>
  );
}
