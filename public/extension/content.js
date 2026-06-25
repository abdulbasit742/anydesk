// AgentFlow Helper — Content Script
// Injected into AI platform pages to detect credit warnings and quota messages.

(function () {
  'use strict';

  const PLATFORM_DETECTORS = {
    'claude.ai': {
      warningSelectors: [
        '[data-testid="usage-limit-banner"]',
        '.usage-limit-warning',
        'div:contains("message limit")',
        'div:contains("daily limit")',
      ],
    },
    'chat.openai.com': {
      warningSelectors: [
        '.usage-warning',
        '[data-testid="upgrade-nudge"]',
        'div:contains("You\'ve reached your limit")',
        'div:contains("GPT-4 limit")',
      ],
    },
    'gemini.google.com': {
      warningSelectors: [
        '.quota-warning',
        'div:contains("rate limit")',
        'div:contains("too many messages")',
      ],
    },
  };

  function detectPlatform() {
    const hostname = window.location.hostname;
    for (const [domain, config] of Object.entries(PLATFORM_DETECTORS)) {
      if (hostname.includes(domain)) return { platform: domain.split('.')[0], config };
    }
    return null;
  }

  function checkForWarnings(config) {
    for (const selector of config.warningSelectors) {
      try {
        const el = document.querySelector(selector);
        if (el && el.offsetParent !== null) return true;
      } catch (_) {}
    }
    // Text-based detection
    const bodyText = document.body?.innerText || '';
    const warningPhrases = [
      'message limit', 'daily limit', 'usage limit', 'quota exceeded',
      'rate limit', "you've reached", 'upgrade to continue', 'subscription required',
    ];
    return warningPhrases.some(phrase => bodyText.toLowerCase().includes(phrase));
  }

  function sendWarning(platform, severity = 'medium') {
    chrome.runtime.sendMessage({
      type: 'CREDIT_WARNING',
      platform,
      severity,
      url: window.location.href,
      timestamp: Date.now(),
    });
  }

  const detected = detectPlatform();
  if (!detected) return;

  const { platform, config } = detected;

  // Observe DOM changes for dynamic warning injection
  const observer = new MutationObserver(() => {
    if (checkForWarnings(config)) {
      sendWarning(platform);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check
  if (checkForWarnings(config)) {
    sendWarning(platform, 'high');
  }

  console.log(`[AgentFlow] Monitoring ${platform} for credit warnings...`);
})();
