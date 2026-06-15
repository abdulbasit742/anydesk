import { CheckCircle2, RefreshCw } from "lucide-react";
import type { ScreenSource } from "../types/screen.js";

interface ScreenSourcePickerProps {
  sources: ScreenSource[];
  selectedId: string;
  onRefresh: () => void;
  onSelect: (source: ScreenSource) => void;
}

export function ScreenSourcePicker({ sources, selectedId, onRefresh, onSelect }: ScreenSourcePickerProps) {
  return (
    <section className="panel">
      <div className="sectionHeader">
        <div>
          <h2>Screen sources</h2>
          <p className="inlineHint">Choose the screen or window that will be shared with the remote viewer.</p>
        </div>
        <button className="secondaryButton" onClick={onRefresh}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="sources">
        {sources.map((source) => {
          const selected = selectedId === source.id;
          return (
            <button
              key={source.id}
              type="button"
              className={`source sourceButton${selected ? " selected" : ""}`}
              onClick={() => onSelect(source)}
            >
              <img src={source.thumbnail} alt="" />
              <span>{source.name}</span>
              {selected ? <CheckCircle2 className="sourceCheck" size={18} /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
