export interface RemoteDeskSelectedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  lastModified: number;
  pathToken: string;
}

export interface RemoteDeskSaveTarget {
  accepted: boolean;
  pathToken?: string;
  fileName?: string;
}

export interface RemoteDeskFileTransferApi {
  pickFiles(options?: { allowMultiple?: boolean; maxBytes?: number }): Promise<RemoteDeskSelectedFile[]>;
  chooseSaveTarget(offer: { transferId: string; fileName: string; size: number }): Promise<RemoteDeskSaveTarget>;
  readFileChunk(input: { pathToken: string; offset: number; length: number }): Promise<ArrayBuffer>;
  writeReceivedChunk(input: { pathToken: string; offset: number; bytes: ArrayBuffer }): Promise<{ bytesWritten: number }>;
  finalizeReceivedFile(input: { pathToken: string; expectedBytes: number }): Promise<{ ok: true; bytesWritten: number }>;
  cancelFileToken(pathToken: string): Promise<void>;
}

export interface RemoteDeskClipboardApi {
  readText(): Promise<{ text: string; changedAt: number }>;
  writeText(input: { text: string; sourceSessionId: string }): Promise<{ ok: true }>;
}

export interface RemoteDeskInputApi {
  setRemoteInputEnabled(input: { sessionId: string; enabled: boolean }): Promise<{ enabled: boolean }>;
  emergencyStop(input: { sessionId: string; reason?: string }): Promise<{ enabled: false }>;
  getRemoteInputState(input: { sessionId: string }): Promise<{ enabled: boolean; emergencyStopped: boolean }>;
}

export interface RemoteDeskDiagnosticsApi {
  exportSupportBundle(input: { fileName: string; json: string }): Promise<{ accepted: boolean; path?: string }>;
}

declare global {
  interface Window {
    remoteDeskFileTransfer?: RemoteDeskFileTransferApi;
    remoteDeskClipboard?: RemoteDeskClipboardApi;
    remoteDeskInput?: RemoteDeskInputApi;
    remoteDeskDiagnostics?: RemoteDeskDiagnosticsApi;
  }
}

export {};
