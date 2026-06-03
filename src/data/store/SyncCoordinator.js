// SyncCoordinator.js — Synchronizes state across tabs/windows using BroadcastChannel API
const CHANNEL_NAME = 'bsp-sync-channel';
const MSG_STATE_UPDATE = 'STATE_UPDATE';
const MSG_REQUEST_STATE = 'REQUEST_STATE';
const MSG_STATE_RESPONSE = 'STATE_RESPONSE';

let channel = null;
let onStateUpdate = null;
let currentState = null;

export function initSync(initialState, updateCallback) {
  currentState = initialState;
  onStateUpdate = updateCallback;

  if (!window.BroadcastChannel) {
    console.warn('[SyncCoordinator] BroadcastChannel not supported');
    return;
  }

  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = handleMessage;

  // Request state from other tabs on init
  channel.postMessage({ type: MSG_REQUEST_STATE, tabId: getTabId() });
}

function handleMessage(event) {
  const { type, payload, tabId } = event.data;

  if (tabId === getTabId()) return; // Ignore own messages

  switch (type) {
    case MSG_STATE_UPDATE:
      currentState = payload;
      onStateUpdate?.(payload);
      break;
    case MSG_REQUEST_STATE:
      if (currentState) {
        channel.postMessage({
          type: MSG_STATE_RESPONSE,
          payload: currentState,
          tabId: getTabId(),
        });
      }
      break;
    case MSG_STATE_RESPONSE:
      if (!currentState) {
        currentState = payload;
        onStateUpdate?.(payload);
      }
      break;
  }
}

export function broadcastStateUpdate(newState) {
  currentState = newState;
  channel?.postMessage({
    type: MSG_STATE_UPDATE,
    payload: newState,
    tabId: getTabId(),
  });
}

export function destroySync() {
  channel?.close();
  channel = null;
}

function getTabId() {
  if (!sessionStorage.getItem('bsp-tab-id')) {
    sessionStorage.setItem('bsp-tab-id', Math.random().toString(36).slice(2));
  }
  return sessionStorage.getItem('bsp-tab-id');
}
