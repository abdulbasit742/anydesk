export type EventHandler<T> = (event: T) => void;

export class TypedEventBus<T extends { type: string }> {
  private readonly handlers = new Map<string, Set<EventHandler<T>>>();

  on(type: T["type"], handler: EventHandler<T>): () => void {
    const set = this.handlers.get(type) ?? new Set<EventHandler<T>>();
    set.add(handler);
    this.handlers.set(type, set);
    return () => set.delete(handler);
  }

  emit(event: T): void {
    for (const handler of this.handlers.get(event.type) ?? []) handler(event);
  }

  clear(): void {
    this.handlers.clear();
  }
}
