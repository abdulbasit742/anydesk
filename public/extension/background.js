// AgentFlow Helper — Background Service Worker
// Monitors connected tabs and relays credit warnings to the AgentFlow dashboard.

const AGENTFLOW_DASHBOARD = 'http://localhost:5173';
const PLATFORMS = {
  'claude.ai': 'claude',
  'chat.openai.com': 'gpt',
  'gemini.google.com': 'gemini',
  'bolt.new': 'bolt',
  'lovable.dev': 'lovable',
};

// Track active platform tabs
const activeTabs = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  try {
    const url = new URL(tab.url);
    const platformId = Object.entries(PLATFORMS).find(([host]) => url.hostname.includes(host));
    if (platformId) {
      activeTabs.set(tabId, { platform: platformId[1], url: tab.url });
      notifyDashboard('tab_connected', { platform: platformId[1], tabId });
    }
  } catch (_) {}
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeTabs.has(tabId)) {
    const { platform } = activeTabs.get(tabId);
    activeTabs.delete(tabId);
    notifyDashboard('tab_disconnected', { platform, tabId });
  }
});

// Listen for credit warning messages from content scripts
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'CREDIT_WARNING') {
    notifyDashboard('credit_warning', {
      platform: message.platform,
      severity: message.severity,
      tabId: sender.tab?.id,
    });
    // Trigger auto-handoff if configured
    chrome.storage.local.get('autoHandoff', ({ autoHandoff }) => {
      if (autoHandoff) {
        triggerAutoHandoff(message.platform);
      }
    });
  }
  if (message.type === 'GET_STATUS') {
    return Promise.resolve({
      activePlatforms: Array.from(activeTabs.values()),
      connected: activeTabs.size > 0,
    });
  }
});

function notifyDashboard(event, data) {
  chrome.storage.local.set({
    [`event_${Date.now()}`]: { event, data, timestamp: Date.now() },
  });
}

function triggerAutoHandoff(fromPlatform) {
  const platforms = Object.values(PLATFORMS);
  const idx = platforms.indexOf(fromPlatform);
  const nextPlatform = platforms[(idx + 1) % platforms.length];
  console.log(`[AgentFlow] Auto-handoff from ${fromPlatform} → ${nextPlatform}`);
}

// Set up periodic ping alarm
chrome.alarms.create('healthPing', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'healthPing') {
    notifyDashboard('health_ping', { activeTabs: activeTabs.size });
  }
});
