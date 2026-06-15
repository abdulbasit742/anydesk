export interface ScreenSource {
  id: string;
  name: string;
  thumbnail: string;
}

export interface CaptureOptions {
  sourceId: string;
  width?: number;
  height?: number;
  frameRate?: number;
}

export interface CaptureState {
  source: ScreenSource | null;
  stream: MediaStream | null;
  status: "idle" | "starting" | "capturing" | "failed";
  error: string;
}
