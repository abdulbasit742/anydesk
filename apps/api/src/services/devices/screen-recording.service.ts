import { prisma } from "../../lib/prisma.js";
export const screenRecordingService = {
  async startRecording(sessionId: string, options: { quality: string; fps: number; includeAudio: boolean }) {
    return prisma.recording.create({ data: { sessionId, quality: options.quality, fps: options.fps, includeAudio: options.includeAudio, status: "recording", startedAt: new Date() } });
  },
  async stopRecording(recordingId: string, fileSize: number, filePath: string) {
    const recording = await prisma.recording.findUnique({ where: { id: recordingId } });
    if (!recording) throw new Error("Recording not found");
    const duration = Math.round((Date.now() - recording.startedAt.getTime()) / 1000);
    return prisma.recording.update({ where: { id: recordingId }, data: { status: "completed", endedAt: new Date(), duration, fileSize, filePath } });
  },
  async getRecordings(userId: string, limit: number = 20) { return prisma.recording.findMany({ where: { session: { userId } }, orderBy: { startedAt: "desc" }, take: limit }); },
  async deleteRecording(recordingId: string) { return prisma.recording.delete({ where: { id: recordingId } }); },
};
