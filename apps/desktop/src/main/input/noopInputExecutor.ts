import type { InputExecutionResult, InputExecutor, NormalizedInputEvent } from './inputExecutor.js';

export class NoopInputExecutor implements InputExecutor {
  readonly name = 'noop-input-executor';
  readonly nativeExecutionEnabled = false;

  async execute(_event: NormalizedInputEvent): Promise<InputExecutionResult> {
    return {
      accepted: true,
      executed: false,
      reason: 'native input execution is disabled by default',
    };
  }
}
