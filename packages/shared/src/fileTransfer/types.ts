export type FileTransferStatus =
  | "pending"
  | "in-progress"
  | "paused"
  | "cancelled"
  | "completed"
  | "failed";

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  lastModified: number;
}

export interface FileTransferState {
  id: string;
  metadata: FileMetadata;
  status: FileTransferStatus;
  totalBytes: number;
  transferredBytes: number;
  startedAt: number | null;
  updatedAt: number;
  endedAt: number | null;
  error: string | null;
}

export type FileTransferAction =
  | { type: "accept"; at?: number }
  | { type: "reject"; reason: string; at?: number }
  | { type: "chunk"; bytes: number; at?: number }
  | { type: "pause"; at?: number }
  | { type: "resume"; at?: number }
  | { type: "cancel"; reason?: string; at?: number }
  | { type: "fail"; error: string; at?: number }
  | { type: "complete"; at?: number };
