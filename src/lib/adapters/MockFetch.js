// MockFetch.js — Intercepts browser networking calls and forwards to local mock controllers
const handlers = new Map();
let originalFetch = null;
let intercepting = false;

export function registerHandler(urlPattern, handler) {
  handlers.set(urlPattern instanceof RegExp ? urlPattern : new RegExp(urlPattern), handler);
}

export function startIntercepting() {
  if (intercepting) return;
  intercepting = true;
  originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const urlStr = typeof url === 'string' ? url : url.toString();

    for (const [pattern, handler] of handlers) {
      if (pattern.test(urlStr)) {
        const mockResponse = await handler({ url: urlStr, options });
        return new Response(JSON.stringify(mockResponse.body), {
          status: mockResponse.status || 200,
          headers: { 'Content-Type': 'application/json', ...mockResponse.headers },
        });
      }
    }

    return originalFetch(url, options);
  };
}

export function stopIntercepting() {
  if (!intercepting) return;
  intercepting = false;
  if (originalFetch) window.fetch = originalFetch;
}

export function clearHandlers() { handlers.clear(); }

export function registerMockAPI(baseUrl, routes = {}) {
  for (const [path, response] of Object.entries(routes)) {
    registerHandler(`${baseUrl}${path}`, typeof response === 'function' ? response : () => ({ status: 200, body: response }));
  }
}

export function isIntercepting() { return intercepting; }
export function getHandlerCount() { return handlers.size; }
