export function syntheticProbeIntervalValid(seconds: number): boolean {
  return seconds >= 30 && seconds <= 3600;
}
