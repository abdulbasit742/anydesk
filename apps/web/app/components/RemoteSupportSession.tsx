"use client";
import { AlertCircle, Camera, Check, Clock, Copy, Monitor, MousePointer, Pause, Play, Square, StickyNote } from "lucide-react";
import { useState } from "react";

interface SessionEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export function RemoteSupportSession({ sessionCode = "ABC123", customerName = "John Smith", agentName = "Sarah Johnson" }: { sessionCode?: string; customerName?: string; agentName?: string }) {
  const [isControlling, setIsControlling] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const events: SessionEvent[] = [
    { id: "1", type: "connected", description: "Session created", timestamp: "10:30:00" },
    { id: "2", type: "connected", description: "Customer connected", timestamp: "10:30:45" },
    { id: "3", type: "screen_shared", description: "Screen sharing started", timestamp: "10:31:00" },
    { id: "4", type: "control_granted", description: "Remote control granted", timestamp: "10:32:15" },
  ];

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <h2 className="text-white text-sm font-medium">Remote Support Session</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Code:</span>
            <code className="text-xs font-mono text-blue-400 bg-slate-700 px-2 py-0.5 rounded">{sessionCode}</code>
            <button onClick={copyCode} className="text-slate-400 hover:text-white">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          {isRecording && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Recording
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Customer: <span className="text-white">{customerName}</span></span>
          <span>|</span>
          <span>Agent: <span className="text-white">{agentName}</span></span>
          <span>|</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 00:05:32</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Remote Screen View */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          <div className="absolute inset-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Customer&apos;s screen is being shared</p>
              <p className="text-slate-500 text-xs mt-1">Resolution: 1920x1080 | FPS: 30</p>
            </div>
          </div>
          {/* Control indicator */}
          {isControlling && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-500/90 text-white text-xs rounded-full flex items-center gap-2">
              <MousePointer className="w-3 h-3" /> You have remote control
            </div>
          )}
          {isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Pause className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-white text-sm">Session Paused</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Session Events */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-white text-xs font-medium uppercase">Session Events</h3>
            </div>
            <div className="p-3 space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-300">{event.description}</p>
                    <p className="text-[10px] text-slate-500">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="p-3 border-t border-slate-700">
              <h3 className="text-white text-xs font-medium uppercase mb-2 flex items-center gap-1"><StickyNote className="w-3 h-3" /> Notes</h3>
              <div className="space-y-1 mb-2">
                {notes.map((n, i) => (
                  <p key={i} className="text-xs text-slate-300 bg-slate-700/50 p-2 rounded">{n}</p>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Add note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  className="flex-1 px-2 py-1.5 bg-slate-700 rounded text-xs text-white placeholder-slate-400 border-0 focus:outline-none"
                />
                <button onClick={addNote} className="px-2 py-1.5 bg-blue-600 text-white rounded text-xs">Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsControlling(!isControlling)}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${isControlling ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            <MousePointer className="w-3 h-3" /> {isControlling ? "Release Control" : "Request Control"}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 bg-slate-700 text-slate-300 hover:bg-slate-600"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 bg-slate-700 text-slate-300 hover:bg-slate-600">
            <Camera className="w-3 h-3" /> Screenshot
          </button>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 flex items-center gap-2">
          <Square className="w-3 h-3" /> End Session
        </button>
      </div>
    </div>
  );
}
