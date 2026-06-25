/* global chrome */
// src/extensions/agentflow-helper/background.js
// Handles messages between content scripts and the main AgentFlow SaaS dashboard.

chrome.runtime.onInstalled.addListener(() => {
  console.log('AgentFlow Handoff Companion installed.');
  chrome.storage.local.set({ activeRelay: null, accounts: [] });
});

// Listener for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CREDIT_STATUS_UPDATE') {
    console.log(`Credits status updated for ${request.platform}:`, request.credits);
    // Forward message to any open AgentFlow tabs
    chrome.tabs.query({ url: '*://localhost/*', title: '*AgentFlow*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'DASHBOARD_SYNC',
          platform: request.platform,
          credits: request.credits,
          accountName: request.accountName
        });
      });
    });
    sendResponse({ success: true });
  }
  return true;
});
