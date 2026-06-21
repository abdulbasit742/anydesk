/* global chrome */
// src/extensions/agentflow-helper/content.js
// Scrapes LLM chat client pages (Claude, ChatGPT, Gemini) for credit thresholds

const monitorCredits = () => {
  const host = window.location.hostname;

  if (host.includes('claude.ai')) {
    // Claude limits monitor
    const indicator = document.querySelector('[class*="credit"], [class*="quota"], [class*="usage"]');
    if (indicator) {
      const text = indicator.innerText;
      const match = /(\d+)\s*%\s*remaining|(\d+)\s*\/\s*(\d+)/i.exec(text);
      if (match) {
        const credits = match[1] ? Number(match[0]) : (Number(match[2]) / Number(match[3])) * 100;
        chrome.runtime.sendMessage({
          type: 'CREDIT_STATUS_UPDATE',
          platform: 'Anthropic',
          credits: Math.round(credits),
          accountName: 'Claude Browser Session'
        });
      }
    }
  } else if (host.includes('openai.com') || host.includes('chatgpt.com')) {
    // ChatGPT limits monitor
    const quotaText = document.body.innerText;
    const match = /You've reached your limit/i.exec(quotaText);
    if (match) {
      chrome.runtime.sendMessage({
        type: 'CREDIT_STATUS_UPDATE',
        platform: 'OpenAI',
        credits: 0,
        accountName: 'ChatGPT Browser Session'
      });
    }
  }
};

// Check every 10 seconds
setInterval(monitorCredits, 10000);
// Initial check after page loads
window.addEventListener('load', monitorCredits);
