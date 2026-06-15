export function validateTicketSubject(subject: string): string[] {
  const errors: string[] = [];
  if (subject.trim().length < 5) errors.push('subject must be at least 5 characters');
  if (subject.length > 140) errors.push('subject must be at most 140 characters');
  return errors;
}

export function validateTicketComment(body: string): string[] {
  const errors: string[] = [];
  if (body.trim().length < 2) errors.push('comment must not be empty');
  if (body.length > 10000) errors.push('comment must be at most 10000 characters');
  return errors;
}
