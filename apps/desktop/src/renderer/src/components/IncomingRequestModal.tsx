import { useEffect, useState } from "react";
import type { IncomingRequestPayload } from "@shared/index";

interface IncomingRequestModalProps {
  request: IncomingRequestPayload;
  onAccept: () => void;
  onReject: (reason?: string) => void;
}

const requestTimeoutSeconds = 30;

export function IncomingRequestModal({ request, onAccept, onReject }: IncomingRequestModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(requestTimeoutSeconds);

  useEffect(() => {
    setSecondsLeft(requestTimeoutSeconds);
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      onReject("timeout");
    }, requestTimeoutSeconds * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [request.sessionId, onReject]);

  return (
    <div className="incomingOverlay" role="dialog" aria-modal="true" aria-labelledby="incoming-title">
      <section className="incomingModal">
        <div className="incomingHeader">
          <div>
            <p className="incomingEyebrow">Incoming connection</p>
            <h2 id="incoming-title">Remote access request</h2>
          </div>
          <span className="incomingTimer">{secondsLeft}s</span>
        </div>

        <div className="incomingBody">
          <div className="incomingAvatar">{request.requesterRemoteDeskId.slice(-2)}</div>
          <div>
            <p className="incomingTitle">Device {formatRemoteDeskId(request.requesterRemoteDeskId)}</p>
            <p className="incomingMeta">Session {request.sessionId.slice(0, 8)}</p>
          </div>
        </div>

        <p className="incomingWarning">
          Accept only if you trust this person. Remote control stays permission gated and can be disconnected anytime.
        </p>

        <div className="incomingActions">
          <button className="secondaryButton" onClick={() => onReject("rejected")}>
            Reject
          </button>
          <button onClick={onAccept}>
            Accept
          </button>
        </div>
      </section>
    </div>
  );
}

function formatRemoteDeskId(id: string) {
  return id.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}
