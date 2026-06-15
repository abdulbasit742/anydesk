import React from 'react';
import type { TimelineEntry } from '../../types/desktopPart2.js';

export function SessionTimeline({ entries }: { entries: TimelineEntry[] }): JSX.Element {
  return (
    <section className="rd-session-timeline">
      <h3>Session timeline</h3>
      {entries.length === 0 ? <p className="rd-empty-state">No timeline events yet.</p> : null}
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} data-level={entry.level}>
            <time>{new Date(entry.at).toLocaleTimeString()}</time>
            <strong>{entry.title}</strong>
            {entry.detail ? <span>{entry.detail}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
