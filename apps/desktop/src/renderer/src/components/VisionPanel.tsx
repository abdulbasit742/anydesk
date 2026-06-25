import { useEffect, useState } from "react";
import { Eye, AlertCircle, Loader } from "lucide-react";
import type { VisionEvent } from "../services/visionWorker.js";

interface VisionPanelProps {
  sessionId: string;
  isActive: boolean;
}

export function VisionPanel({ sessionId, isActive }: VisionPanelProps) {
  const [events, setEvents] = useState<VisionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Poll for vision events from backend
    const pollInterval = setInterval(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vision/events/${sessionId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("rd_desktop_access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setEvents(data.data.slice(0, 10)); // Show last 10 events
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to fetch vision events:", error);
      } finally {
        setIsLoading(false);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [sessionId, isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="visionPanel">
      <div className="visionPanelHeader">
        <div className="visionPanelTitle">
          <Eye size={16} />
          <strong>AI Vision</strong>
        </div>
        {isLoading && <Loader size={14} className="spinner" />}
      </div>

      <div className="visionPanelContent">
        {events.length === 0 ? (
          <p className="muted">No vision events detected yet.</p>
        ) : (
          <div className="visionEventsList">
            {events.map((event, idx) => (
              <div key={idx} className="visionEventItem">
                <div className="eventHeader">
                  {event.eventType === "error_detected" && <AlertCircle size={14} />}
                  <span className="eventType">{event.eventType}</span>
                  <span className="eventConfidence">{(event.confidence * 100).toFixed(0)}%</span>
                </div>
                {event.metadata?.text && (
                  <p className="eventText">{event.metadata.text.substring(0, 100)}</p>
                )}
                <span className="eventTime">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {lastUpdate && (
        <div className="visionPanelFooter">
          <small>Last update: {lastUpdate.toLocaleTimeString()}</small>
        </div>
      )}
    </div>
  );
}
