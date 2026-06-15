import { useEffect, useRef } from "react";
import { MonitorUp, Square } from "lucide-react";
import type { CaptureState } from "../types/screen.js";

interface ScreenPreviewProps {
  capture: CaptureState;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function ScreenPreview({ capture, onStart, onStop, disabled }: ScreenPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = capture.stream;
    }
  }, [capture.stream]);

  const isCapturing = capture.status === "capturing";
  const isStarting = capture.status === "starting";

  return (
    <section className="panel">
      <div className="sectionHeader">
        <div>
          <h2>Capture preview</h2>
          <p className="inlineHint">
            {capture.source ? capture.source.name : "Select a source before starting capture."}
          </p>
        </div>
        {isCapturing ? (
          <button className="secondaryButton" onClick={onStop}>
            <Square size={16} /> Stop
          </button>
        ) : (
          <button onClick={onStart} disabled={disabled || isStarting}>
            <MonitorUp size={16} /> {isStarting ? "Starting..." : "Start capture"}
          </button>
        )}
      </div>

      <div className={`previewFrame${isCapturing ? " live" : ""}`}>
        {capture.stream ? (
          <video ref={videoRef} autoPlay muted playsInline />
        ) : (
          <div className="previewEmpty">
            <MonitorUp size={34} />
            <span>No local stream yet</span>
          </div>
        )}
      </div>

      {capture.error ? <p className="errorText">{capture.error}</p> : null}
    </section>
  );
}
