export interface SessionNote {
  id: string;
  sessionId: string;
  body: string;
  privateToSupport: boolean;
  createdAt: string;
}

export function validateSessionNote(note: Pick<SessionNote, "body">): string[] {
  const errors: string[] = [];
  if (!note.body.trim()) errors.push("empty-note");
  if (note.body.length > 5000) errors.push("note-too-long");
  return errors;
}
