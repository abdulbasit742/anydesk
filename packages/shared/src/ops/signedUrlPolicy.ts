export interface SignedUrlPolicy {
  expiresInSeconds: number;
  maxBytes: number;
  allowedContentTypes: readonly string[];
}

export function validateSignedUrlRequest(input: { bytes: number; contentType: string }, policy: SignedUrlPolicy): string[] {
  const errors: string[] = [];
  if (input.bytes <= 0 || input.bytes > policy.maxBytes) errors.push("invalid-size");
  if (!policy.allowedContentTypes.includes(input.contentType)) errors.push("content-type-not-allowed");
  return errors;
}
