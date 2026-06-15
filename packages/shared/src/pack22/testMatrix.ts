export interface TestMatrixAxis {
  name: string;
  values: string[];
}

export function estimateMatrixCases(axes: readonly TestMatrixAxis[]): number {
  return axes.reduce((total, axis) => total * Math.max(1, axis.values.length), 1);
}

export function matrixTooLarge(axes: readonly TestMatrixAxis[], maxCases = 500): boolean {
  return estimateMatrixCases(axes) > maxCases;
}
