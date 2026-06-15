export interface RegressionRiskInput {
  changedFiles: number;
  touchesAuth: boolean;
  touchesSignaling: boolean;
  touchesBilling: boolean;
  testsFailed: number;
}

export function scoreRegressionRisk(input: RegressionRiskInput): { score: number; band: "low" | "medium" | "high" | "critical" } {
  let score = Math.min(40, input.changedFiles);
  if (input.touchesAuth) score += 20;
  if (input.touchesSignaling) score += 20;
  if (input.touchesBilling) score += 15;
  score += input.testsFailed * 10;
  const band = score >= 80 ? "critical" : score >= 55 ? "high" : score >= 25 ? "medium" : "low";
  return { score, band };
}
