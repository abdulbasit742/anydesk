import type { DataChannelEnvelope } from "./types.js";

export type DataChannelRouteHandler<TPayload = unknown> = (
  envelope: DataChannelEnvelope<TPayload>
) => void;

export interface DataChannelRouterOptions {
  onUnhandled?: (envelope: DataChannelEnvelope) => void;
  onHandlerError?: (error: unknown, envelope: DataChannelEnvelope) => void;
}

export function createDataChannelRouter(options: DataChannelRouterOptions = {}) {
  const handlers = new Map<string, Set<DataChannelRouteHandler>>();

  function subscribe<TPayload>(
    type: string,
    handler: DataChannelRouteHandler<TPayload>
  ) {
    const set = handlers.get(type) ?? new Set<DataChannelRouteHandler>();
    set.add(handler as DataChannelRouteHandler);
    handlers.set(type, set);

    return () => {
      set.delete(handler as DataChannelRouteHandler);
      if (set.size === 0) handlers.delete(type);
    };
  }

  function route(envelope: DataChannelEnvelope) {
    const set = handlers.get(envelope.type);
    if (!set || set.size === 0) {
      options.onUnhandled?.(envelope);
      return false;
    }

    for (const handler of set) {
      try {
        handler(envelope);
      } catch (error) {
        options.onHandlerError?.(error, envelope);
      }
    }

    return true;
  }

  function clear(type?: string) {
    if (type) {
      handlers.delete(type);
      return;
    }
    handlers.clear();
  }

  function getHandlerCount(type?: string) {
    if (type) return handlers.get(type)?.size ?? 0;
    let total = 0;
    for (const set of handlers.values()) total += set.size;
    return total;
  }

  return { subscribe, route, clear, getHandlerCount };
}
