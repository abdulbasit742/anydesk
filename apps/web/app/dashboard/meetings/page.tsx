"use client";
import { Calendar, Camera, CameraOff, Mic, MicOff, Monitor, Phone, PhoneOff, Plus, ScreenShare, Users, Video } from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: string;
  title: string;
  status: "scheduled" | "active" | "ended";
  hostName: string;
  participants: number;
  scheduledAt: string | null;
  duration: string;
  roomCode: string;
}

const mockMeetings: Meeting[] = [
  { id: "m1", title: "Support Team Standup", status: "active", hostName: "Sarah Johnson", participants: 5, scheduledAt: null, duration: "15:32", roomCode: "abc-def-ghi" },
  { id: "m2", title: "Customer Onboarding - Acme Corp", status: "scheduled", hostName: "Mike Chen", participants: 0, scheduledAt: "2024-01-15T14:00:00Z", duration: "-", roomCode: "xyz-uvw-rst" },
  { id: "m3", title: "Escalation Review", status: "scheduled", hostName: "Alex Kumar", participants: 0, scheduledAt: "2024-01-15T16:00:00Z", duration: "-", roomCode: "lmn-opq-rst" },
  { id: "m4", title: "Product Demo - Enterprise", status: "ended", hostName: "Emily Davis", participants: 8, scheduledAt: null, duration: "45:12", roomCode: "jkl-mno-pqr" },
  { id: "m5", title: "Weekly All-Hands", status: "ended", hostName: "Lisa Park", participants: 12, scheduledAt: null, duration: "32:05", roomCode: "stu-vwx-yza" },
];

export default function MeetingsPage() {
  const [joinCode, setJoinCode] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Video Meetings</h1>
            <p className="text-slate-500 mt-1">HD video conferencing with screen sharing and recording</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Enter meeting code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-40" />
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors">Join</button>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> New Meeting
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg"><Video className="w-6 h-6 text-blue-600" /></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Instant Meeting</h3>
                <p className="text-xs text-slate-500">Start a meeting now</p>
              </div>
            </div>
          </button>
          <button className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg"><Calendar className="w-6 h-6 text-purple-600" /></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Schedule Meeting</h3>
                <p className="text-xs text-slate-500">Plan for later</p>
              </div>
            </div>
          </button>
          <button className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg"><ScreenShare className="w-6 h-6 text-green-600" /></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Screen Share Only</h3>
                <p className="text-xs text-slate-500">Quick screen sharing session</p>
              </div>
            </div>
          </button>
        </div>

        {/* Active Meetings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Active Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMeetings.filter((m) => m.status === "active").map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-xl border-2 border-green-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-semibold text-slate-900">{meeting.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{meeting.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" /> {meeting.participants} participants
                    <span className="text-slate-300">|</span>
                    Host: {meeting.hostName}
                  </div>
                  <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Join Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Upcoming</h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {mockMeetings.filter((m) => m.status === "scheduled").map((meeting) => (
              <div key={meeting.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{meeting.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {meeting.scheduledAt && new Date(meeting.scheduledAt).toLocaleString()} • Host: {meeting.hostName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{meeting.roomCode}</span>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Meetings</h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {mockMeetings.filter((m) => m.status === "ended").map((meeting) => (
              <div key={meeting.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{meeting.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{meeting.participants} participants • Duration: {meeting.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50">Recording</button>
                  <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50">Transcript</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
