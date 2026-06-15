export interface CoverageGate {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export function coverageGatePassed(actual: CoverageGate, minimum: CoverageGate): boolean {
  return actual.statements >= minimum.statements && actual.branches >= minimum.branches && actual.functions >= minimum.functions && actual.lines >= minimum.lines;
}
