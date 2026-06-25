/**
 * Audio Streaming Service
 * Captures system audio from the host and streams it to the viewer via WebRTC.
 * Also handles receiving remote audio and playing it locally.
 */

export interface AudioStreamingOptions {
  /** Whether to capture system audio (host side) */
  captureSystemAudio?: boolean;
  /** Whether to play received audio (viewer side) */
  playRemoteAudio?: boolean;
  /** Volume level 0-1 */
  volume?: number;
}

export interface AudioStreamingState {
  isCapturing: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

export class AudioStreamingController {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localAudioStream: MediaStream | null = null;
  private state: AudioStreamingState = {
    isCapturing: false,
    isPlaying: false,
    isMuted: false,
    volume: 1.0,
  };
  private onStateChange?: (state: AudioStreamingState) => void;

  constructor(options?: { onStateChange?: (state: AudioStreamingState) => void }) {
    this.onStateChange = options?.onStateChange;
  }

  getState(): AudioStreamingState {
    return { ...this.state };
  }

  /**
   * Start capturing system audio (host side)
   * Returns the audio stream to add to the WebRTC peer connection
   */
  async startCapture(): Promise<MediaStream | null> {
    try {
      // Use getDisplayMedia with audio to capture system audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } as any,
      });

      // Extract only audio tracks
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        stream.getTracks().forEach(t => t.stop());
        return null;
      }

      // Stop any video tracks (we only want audio)
      stream.getVideoTracks().forEach(t => t.stop());

      this.localAudioStream = new MediaStream(audioTracks);
      this.state.isCapturing = true;
      this.emitState();
      return this.localAudioStream;
    } catch (err) {
      console.warn("[AudioStreaming] Failed to capture system audio:", err);
      return null;
    }
  }

  /**
   * Start playing remote audio (viewer side)
   * Call this when a remote audio track is received
   */
  playRemoteAudio(stream: MediaStream): void {
    if (!this.audioElement) {
      this.audioElement = document.createElement("audio");
      this.audioElement.autoplay = true;
    }

    this.audioElement.srcObject = stream;
    this.audioElement.volume = this.state.volume;
    this.audioElement.muted = this.state.isMuted;
    this.state.isPlaying = true;
    this.emitState();
  }

  /** Set volume (0-1) */
  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.state.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.state.volume;
    }
    this.emitState();
  }

  /** Toggle mute */
  toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.state.isMuted;
    }
    this.emitState();
  }

  /** Mute audio */
  mute(): void {
    this.state.isMuted = true;
    if (this.audioElement) {
      this.audioElement.muted = true;
    }
    this.emitState();
  }

  /** Unmute audio */
  unmute(): void {
    this.state.isMuted = false;
    if (this.audioElement) {
      this.audioElement.muted = false;
    }
    this.emitState();
  }

  /** Stop capturing local audio */
  stopCapture(): void {
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach(t => t.stop());
      this.localAudioStream = null;
    }
    this.state.isCapturing = false;
    this.emitState();
  }

  /** Stop playing remote audio */
  stopPlayback(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.srcObject = null;
    }
    this.state.isPlaying = false;
    this.emitState();
  }

  /** Clean up all resources */
  dispose(): void {
    this.stopCapture();
    this.stopPlayback();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }
  }

  private emitState(): void {
    this.onStateChange?.(this.getState());
  }
}
