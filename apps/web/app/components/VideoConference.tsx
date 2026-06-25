"use client";
import { Camera, CameraOff, Hand, MessageSquare, Mic, MicOff, Monitor, MoreVertical, PhoneOff, ScreenShare, Settings, Users } from "lucide-react";
import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  handRaised: boolean;
}

export function VideoConference({ meetingTitle = "Support Meeting", roomCode = "abc-def-ghi" }: { meetingTitle?: string; roomCode?: string }) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  const participants: Participant[] = [
    { id: "1", name: "You", audioEnabled, videoEnabled, screenSharing, handRaised },
    { id: "2", name: "Sarah Johnson", audioEnabled: true, videoEnabled: true, screenSharing: false, handRaised: false },
    { id: "3", name: "John Smith (Customer)", audioEnabled: true, videoEnabled: false, screenSharing: false, handRaised: true },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-sm font-medium">{meetingTitle}</h2>
          <span className="text-slate-400 text-xs font-mono">{roomCode}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>00:15:32</span>
          <span>|</span>
          <span>{participants.length} participants</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3 h-full">
            {participants.map((p) => (
              <div key={p.id} className="relative bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                {p.videoEnabled ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white text-xl font-bold">
                    {p.name.charAt(0)}
                  </div>
                )}
                {/* Name overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">{p.name}</span>
                  {!p.audioEnabled && <MicOff className="w-3 h-3 text-red-400" />}
                  {p.handRaised && <Hand className="w-3 h-3 text-yellow-400" />}
                </div>
                {p.screenSharing && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-blue-500/80 text-white px-2 py-0.5 rounded">Sharing Screen</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {(chatOpen || participantsOpen) && (
          <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white text-sm font-medium">{chatOpen ? "Chat" : "Participants"}</h3>
              <button onClick={() => { setChatOpen(false); setParticipantsOpen(false); }} className="text-slate-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            {chatOpen && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                  <div className="text-xs"><span className="text-blue-400 font-medium">Sarah:</span> <span className="text-slate-300">Can you share your screen?</span></div>
                  <div className="text-xs"><span className="text-green-400 font-medium">You:</span> <span className="text-slate-300">Sure, one moment</span></div>
                </div>
                <div className="p-3 border-t border-slate-700">
                  <input type="text" placeholder="Send a message..." className="w-full px-3 py-2 bg-slate-700 rounded-lg text-xs text-white placeholder-slate-400 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            )}
            {participantsOpen && (
              <div className="flex-1 p-3 space-y-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs">{p.name.charAt(0)}</div>
                      <span className="text-xs text-white">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {p.audioEnabled ? <Mic className="w-3 h-3 text-slate-400" /> : <MicOff className="w-3 h-3 text-red-400" />}
                      {p.videoEnabled ? <Camera className="w-3 h-3 text-slate-400" /> : <CameraOff className="w-3 h-3 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 py-4 bg-slate-800">
        <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-3 rounded-full ${audioEnabled ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"}`}>
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button onClick={() => setVideoEnabled(!videoEnabled)} className={`p-3 rounded-full ${videoEnabled ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"}`}>
          {videoEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </button>
        <button onClick={() => setScreenSharing(!screenSharing)} className={`p-3 rounded-full ${screenSharing ? "bg-blue-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
          <ScreenShare className="w-5 h-5" />
        </button>
        <button onClick={() => setHandRaised(!handRaised)} className={`p-3 rounded-full ${handRaised ? "bg-yellow-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
          <Hand className="w-5 h-5" />
        </button>
        <button onClick={() => { setChatOpen(!chatOpen); setParticipantsOpen(false); }} className={`p-3 rounded-full ${chatOpen ? "bg-blue-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
          <MessageSquare className="w-5 h-5" />
        </button>
        <button onClick={() => { setParticipantsOpen(!participantsOpen); setChatOpen(false); }} className={`p-3 rounded-full ${participantsOpen ? "bg-blue-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
          <Users className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 ml-4">
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
