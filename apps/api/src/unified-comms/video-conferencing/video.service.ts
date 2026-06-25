/**
 * Video Conferencing Service
 * Full HD video calls with up to 100 participants, screen sharing, recording, etc.
 */

import { randomUUID } from 'node:crypto';

export type MeetingStatus = 'scheduled' | 'active' | 'ended' | 'cancelled';
export type ParticipantRole = 'host' | 'co_host' | 'presenter' | 'attendee';

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  hostId: string;
  status: MeetingStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  duration: number;
  maxParticipants: number;
  participants: Participant[];
  settings: MeetingSettings;
  recordingUrl: string | null;
  transcriptionUrl: string | null;
  chatMessages: MeetingChatMessage[];
  joinUrl: string;
  roomCode: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  role: ParticipantRole;
  joinedAt: string;
  leftAt: string | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  handRaised: boolean;
}

export interface MeetingSettings {
  enableRecording: boolean;
  enableTranscription: boolean;
  enableChat: boolean;
  enableScreenShare: boolean;
  enableVirtualBackground: boolean;
  enableNoiseCancellation: boolean;
  enableLiveCaptions: boolean;
  waitingRoom: boolean;
  muteOnEntry: boolean;
  allowGuestAccess: boolean;
  maxDuration: number;
}

export interface MeetingChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

const meetings = new Map<string, Meeting>();

function generateRoomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const seg = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${seg()}-${seg()}-${seg()}`;
}

export class VideoConferencingService {
  async createMeeting(data: { title: string; hostId: string; description?: string; scheduledAt?: string; settings?: Partial<MeetingSettings> }): Promise<Meeting> {
    const roomCode = generateRoomCode();
    const meeting: Meeting = {
      id: randomUUID(),
      title: data.title,
      description: data.description || null,
      hostId: data.hostId,
      status: data.scheduledAt ? 'scheduled' : 'active',
      scheduledAt: data.scheduledAt || null,
      startedAt: data.scheduledAt ? null : new Date().toISOString(),
      endedAt: null,
      duration: 0,
      maxParticipants: 100,
      participants: [],
      settings: {
        enableRecording: true,
        enableTranscription: true,
        enableChat: true,
        enableScreenShare: true,
        enableVirtualBackground: true,
        enableNoiseCancellation: true,
        enableLiveCaptions: true,
        waitingRoom: false,
        muteOnEntry: true,
        allowGuestAccess: true,
        maxDuration: 3600,
        ...data.settings,
      },
      recordingUrl: null,
      transcriptionUrl: null,
      chatMessages: [],
      joinUrl: `/meeting/${roomCode}`,
      roomCode,
      createdAt: new Date().toISOString(),
    };
    meetings.set(meeting.id, meeting);
    return meeting;
  }

  async getMeeting(id: string): Promise<Meeting | null> {
    return meetings.get(id) || null;
  }

  async getMeetingByCode(code: string): Promise<Meeting | null> {
    return Array.from(meetings.values()).find(m => m.roomCode === code) || null;
  }

  async listMeetings(hostId?: string): Promise<Meeting[]> {
    let results = Array.from(meetings.values());
    if (hostId) results = results.filter(m => m.hostId === hostId);
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async joinMeeting(meetingId: string, user: { userId: string; name: string; email?: string }): Promise<Participant | null> {
    const meeting = meetings.get(meetingId);
    if (!meeting) return null;
    if (meeting.participants.length >= meeting.maxParticipants) return null;

    const participant: Participant = {
      id: randomUUID(),
      userId: user.userId,
      name: user.name,
      email: user.email || null,
      role: meeting.hostId === user.userId ? 'host' : 'attendee',
      joinedAt: new Date().toISOString(),
      leftAt: null,
      audioEnabled: !meeting.settings.muteOnEntry,
      videoEnabled: true,
      screenSharing: false,
      handRaised: false,
    };

    meeting.participants.push(participant);
    if (meeting.status === 'scheduled') {
      meeting.status = 'active';
      meeting.startedAt = new Date().toISOString();
    }
    meetings.set(meetingId, meeting);
    return participant;
  }

  async leaveMeeting(meetingId: string, userId: string): Promise<boolean> {
    const meeting = meetings.get(meetingId);
    if (!meeting) return false;
    const participant = meeting.participants.find(p => p.userId === userId);
    if (participant) {
      participant.leftAt = new Date().toISOString();
    }
    meetings.set(meetingId, meeting);
    return true;
  }

  async endMeeting(meetingId: string): Promise<Meeting | null> {
    const meeting = meetings.get(meetingId);
    if (!meeting) return null;
    meeting.status = 'ended';
    meeting.endedAt = new Date().toISOString();
    if (meeting.startedAt) {
      meeting.duration = Math.floor((new Date(meeting.endedAt).getTime() - new Date(meeting.startedAt).getTime()) / 1000);
    }
    if (meeting.settings.enableRecording) {
      meeting.recordingUrl = `/recordings/meetings/${meeting.id}.mp4`;
    }
    if (meeting.settings.enableTranscription) {
      meeting.transcriptionUrl = `/transcriptions/meetings/${meeting.id}.txt`;
    }
    // Mark all participants as left
    meeting.participants.forEach(p => {
      if (!p.leftAt) p.leftAt = meeting.endedAt!;
    });
    meetings.set(meetingId, meeting);
    return meeting;
  }

  async toggleParticipantMedia(meetingId: string, userId: string, media: 'audio' | 'video' | 'screen'): Promise<Participant | null> {
    const meeting = meetings.get(meetingId);
    if (!meeting) return null;
    const participant = meeting.participants.find(p => p.userId === userId && !p.leftAt);
    if (!participant) return null;

    if (media === 'audio') participant.audioEnabled = !participant.audioEnabled;
    if (media === 'video') participant.videoEnabled = !participant.videoEnabled;
    if (media === 'screen') participant.screenSharing = !participant.screenSharing;

    meetings.set(meetingId, meeting);
    return participant;
  }

  async sendChatMessage(meetingId: string, senderId: string, senderName: string, content: string): Promise<MeetingChatMessage | null> {
    const meeting = meetings.get(meetingId);
    if (!meeting || !meeting.settings.enableChat) return null;

    const message: MeetingChatMessage = {
      id: randomUUID(),
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
    };
    meeting.chatMessages.push(message);
    meetings.set(meetingId, meeting);
    return message;
  }

  async raiseHand(meetingId: string, userId: string): Promise<boolean> {
    const meeting = meetings.get(meetingId);
    if (!meeting) return false;
    const participant = meeting.participants.find(p => p.userId === userId && !p.leftAt);
    if (!participant) return false;
    participant.handRaised = !participant.handRaised;
    meetings.set(meetingId, meeting);
    return true;
  }
}

export const videoConferencingService = new VideoConferencingService();
