export type NormalizedInputEvent =
  | { type: 'pointer.move'; x: number; y: number; viewportWidth: number; viewportHeight: number; at: number }
  | { type: 'pointer.button'; button: 'left' | 'right' | 'middle'; action: 'down' | 'up'; x: number; y: number; at: number }
  | { type: 'pointer.wheel'; deltaX: number; deltaY: number; x: number; y: number; at: number }
  | { type: 'keyboard.key'; code: string; key: string; action: 'down' | 'up'; repeat?: boolean; at: number };

export interface InputExecutionResult {
  accepted: boolean;
  executed: boolean;
  reason?: string;
}

export interface InputExecutor {
  readonly name: string;
  readonly nativeExecutionEnabled: boolean;
  execute(event: NormalizedInputEvent): Promise<InputExecutionResult>;
}
