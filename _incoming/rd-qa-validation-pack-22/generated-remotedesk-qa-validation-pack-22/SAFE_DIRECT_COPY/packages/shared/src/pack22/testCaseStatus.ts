export type TestCaseStatus = "not_run" | "running" | "passed" | "failed" | "blocked" | "flaky";

export function testCaseBlocksRelease(status: TestCaseStatus): boolean {
  return status === "failed" || status === "blocked";
}

export function testCaseIsTerminal(status: TestCaseStatus): boolean {
  return ["passed", "failed", "blocked", "flaky"].includes(status);
}
