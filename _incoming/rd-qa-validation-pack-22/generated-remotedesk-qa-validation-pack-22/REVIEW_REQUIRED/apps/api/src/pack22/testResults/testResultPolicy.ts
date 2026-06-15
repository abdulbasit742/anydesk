export function testResultBlocksRelease(input: { status: string; priority: string; quarantined: boolean }): boolean {
  if (input.quarantined) return false;
  return ["failed", "blocked"].includes(input.status) && ["p0", "p1"].includes(input.priority);
}
