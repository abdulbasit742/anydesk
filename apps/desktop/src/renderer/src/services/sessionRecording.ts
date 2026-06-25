/**
 * Session Recording Service
 * Uses MediaRecorder API to record the remote desktop stream during a session.
 */

export interface SessionRecordingOptions {
  stream: MediaStream;
  sessionId: string;
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export interface SessionRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  startedAt: number | null;
  durationMs: number;
  sizeBytes: number;
}

export class SessionRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private startedAt: number | null = null;
  private sizeBytes = 0;
  private readonly sessionId: string;
  private readonly stream: MediaStream;
  private readonly mimeType: string;
  private readonly videoBitsPerSecond: number;
  private onStateChange?: (state: SessionRecordingState) => void;

  constructor(options: SessionRecordingOptions) {
    this.stream = options.stream;
    this.sessionId = options.sessionId;
    this.mimeType = options.mimeType ?? SessionRecorder.getSupportedMimeType();
    this.videoBitsPerSecond = options.videoBitsPerSecond ?? 2_500_000;
  }

  static getSupportedMimeType(): string {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "video/webm";
  }

  static isSupported(): boolean {
    return typeof MediaRecorder !== "undefined";
  }

  setOnStateChange(callback: (state: SessionRecordingState) => void): void {
    this.onStateChange = callback;
  }

  start(): void {
    if (this.recorder?.state === "recording") return;

    this.chunks = [];
    this.sizeBytes = 0;
    this.startedAt = Date.now();

    this.recorder = new MediaRecorder(this.stream, {
      mimeType: this.mimeType,
      videoBitsPerSecond: this.videoBitsPerSecond,
    });

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
        this.sizeBytes += event.data.size;
        this.emitState();
      }
    };

    this.recorder.onstop = () => {
      this.emitState();
    };

    // Request data every 1 second for progress tracking
    this.recorder.start(1000);
    this.emitState();
  }

  pause(): void {
    if (this.recorder?.state === "recording") {
      this.recorder.pause();
      this.emitState();
    }
  }

  resume(): void {
    if (this.recorder?.state === "paused") {
      this.recorder.resume();
      this.emitState();
    }
  }

  stop(): Blob | null {
    if (!this.recorder || this.recorder.state === "inactive") return null;

    this.recorder.stop();
    const blob = new Blob(this.chunks, { type: this.mimeType });
    this.chunks = [];
    this.startedAt = null;
    this.emitState();
    return blob;
  }

  async stopAndSave(): Promise<void> {
    const blob = this.stop();
    if (!blob) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `remotedesk-recording-${this.sessionId}-${timestamp}.webm`;

    // Use Electron's save dialog if available
    if (window.remoteDeskFileTransfer?.chooseSaveTarget) {
      const target = await window.remoteDeskFileTransfer.chooseSaveTarget({
        transferId: `recording-${this.sessionId}`,
        fileName: filename,
        size: blob.size,
      });
      if (target.accepted && target.pathToken) {
        const buffer = await blob.arrayBuffer();
        await window.remoteDeskFileTransfer.writeReceivedChunk({
          pathToken: target.pathToken,
          offset: 0,
          bytes: buffer,
        });
        await window.remoteDeskFileTransfer.finalizeReceivedFile({
          pathToken: target.pathToken,
          expectedBytes: blob.size,
        });
      }
    } else {
      // Fallback: browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  getState(): SessionRecordingState {
    return {
      isRecording: this.recorder?.state === "recording",
      isPaused: this.recorder?.state === "paused",
      startedAt: this.startedAt,
      durationMs: this.startedAt ? Date.now() - this.startedAt : 0,
      sizeBytes: this.sizeBytes,
    };
  }

  dispose(): void {
    if (this.recorder && this.recorder.state !== "inactive") {
      this.recorder.stop();
    }
    this.recorder = null;
    this.chunks = [];
  }

  private emitState(): void {
    this.onStateChange?.(this.getState());
  }
}
