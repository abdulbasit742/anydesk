export function invoiceCanBeDownloaded(status: string): boolean {
  return ["open", "paid", "void", "uncollectible"].includes(status);
}
