export interface MotionPreference {
  reduceMotion: boolean;
}

export function animationDurationMs(preference: MotionPreference, defaultMs: number): number {
  return preference.reduceMotion ? 0 : defaultMs;
}
