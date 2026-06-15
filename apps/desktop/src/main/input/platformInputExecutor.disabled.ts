import type { InputExecutionResult, InputExecutor, NormalizedInputEvent } from './inputExecutor.js';

export class DisabledPlatformInputExecutor implements InputExecutor {
  readonly name = 'disabled-platform-input-executor';
  readonly nativeExecutionEnabled = false;

  async execute(_event: NormalizedInputEvent): Promise<InputExecutionResult> {
    return {
      accepted: false,
      executed: false,
      reason: 'platform native input executor is not compiled into this build',
    };
  }
}

export function createPlatformInputExecutor(): InputExecutor {
  return new DisabledPlatformInputExecutor();
}
