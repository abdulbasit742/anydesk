import type { BackpressureState } from "./types.js";

export function createBackpressureController(highWaterMark: number, lowWaterMark: number) {
  if (highWaterMark <= 0) {
    throw new RangeError("highWaterMark must be greater than 0");
  }
  if (lowWaterMark < 0 || lowWaterMark > highWaterMark) {
    throw new RangeError("lowWaterMark must be between 0 and highWaterMark");
  }

  let queuedBytes = 0;
  let isThrottled = false;

  function canSend() {
    return !isThrottled;
  }

  function onBytesQueued(bytes: number) {
    queuedBytes = Math.max(0, queuedBytes + bytes);
    if (queuedBytes >= highWaterMark) {
      isThrottled = true;
    }
  }

  function onBufferedAmountChanged(bufferedAmount: number) {
    queuedBytes = Math.max(0, bufferedAmount);
    if (queuedBytes <= lowWaterMark) {
      isThrottled = false;
    }
  }

  function getState(): BackpressureState {
    return { queuedBytes, isThrottled, highWaterMark, lowWaterMark };
  }

  return { canSend, onBytesQueued, onBufferedAmountChanged, getState };
}
