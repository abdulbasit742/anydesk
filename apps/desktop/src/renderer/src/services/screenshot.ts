/**
 * Screenshot Service
 * Captures the current frame from the remote desktop video stream.
 */

export interface ScreenshotOptions {
  video: HTMLVideoElement;
  sessionId: string;
  format?: "image/png" | "image/jpeg";
  quality?: number;
}

export function captureScreenshot(options: ScreenshotOptions): Blob | null {
  const { video, format = "image/png", quality = 0.92 } = options;

  if (!video.videoWidth || !video.videoHeight) return null;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to blob synchronously via data URL
  const dataUrl = canvas.toDataURL(format, quality);
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export async function captureAndSaveScreenshot(options: ScreenshotOptions): Promise<void> {
  const blob = captureScreenshot(options);
  if (!blob) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const ext = options.format === "image/jpeg" ? "jpg" : "png";
  const filename = `remotedesk-screenshot-${options.sessionId}-${timestamp}.${ext}`;

  // Use Electron's save dialog if available
  if (window.remoteDeskFileTransfer?.chooseSaveTarget) {
    const target = await window.remoteDeskFileTransfer.chooseSaveTarget({
      transferId: `screenshot-${Date.now()}`,
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

export function captureScreenshotAsDataUrl(options: ScreenshotOptions): string | null {
  const { video, format = "image/png", quality = 0.92 } = options;

  if (!video.videoWidth || !video.videoHeight) return null;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(format, quality);
}
