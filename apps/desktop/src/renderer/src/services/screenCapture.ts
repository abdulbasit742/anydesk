import type { CaptureOptions, ScreenSource } from "../types/screen.js";

type ElectronVideoConstraints = MediaTrackConstraints & {
  mandatory: {
    chromeMediaSource: "desktop";
    chromeMediaSourceId: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    minFrameRate?: number;
    maxFrameRate?: number;
  };
};

export async function loadScreenSources(): Promise<ScreenSource[]> {
  return window.remoteDesk.screenSources();
}

export async function createScreenCaptureStream(options: CaptureOptions): Promise<MediaStream> {
  const width = options.width ?? 1920;
  const height = options.height ?? 1080;
  const frameRate = options.frameRate ?? 30;

  const video = {
    mandatory: {
      chromeMediaSource: "desktop",
      chromeMediaSourceId: options.sourceId,
      minWidth: 640,
      maxWidth: width,
      minHeight: 360,
      maxHeight: height,
      minFrameRate: 5,
      maxFrameRate: frameRate
    }
  } satisfies ElectronVideoConstraints;

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: video as unknown as MediaTrackConstraints
  });
}

export function stopScreenCaptureStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}
