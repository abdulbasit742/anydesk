export function createLatencyTracker(windowSize = 10) {
  if (windowSize < 1) {
    throw new RangeError("windowSize must be at least 1");
  }

  const samples: number[] = [];

  function record(rttMs: number) {
    if (!Number.isFinite(rttMs) || rttMs < 0) return;
    samples.push(rttMs);
    if (samples.length > windowSize) samples.shift();
  }

  function average() {
    if (samples.length === 0) return null;
    return samples.reduce((total, sample) => total + sample, 0) / samples.length;
  }

  function min() {
    return samples.length === 0 ? null : Math.min(...samples);
  }

  function max() {
    return samples.length === 0 ? null : Math.max(...samples);
  }

  function reset() {
    samples.length = 0;
  }

  return { record, average, min, max, reset };
}
