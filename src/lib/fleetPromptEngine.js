// src/lib/fleetPromptEngine.js
// Handles broadcasting prompts to multiple accounts concurrently with credit tracking

import { relayBroadcast } from './relayEngine';

/**
 * Sends a prompt to a fleet of target accounts.
 * Deducts credits and runs connection tests for each account.
 *
 * @param {string} prompt - The command or instruction to dispatch
 * @param {string[]} targetIds - List of account IDs in the fleet
 * @param {number} costPerAccount - Credit cost per target account (default 1)
 * @returns {Promise<object>} Run summary
 */
export async function sendFleetPrompt(prompt, targetIds, costPerAccount = 1) {
  if (!prompt || !prompt.trim()) {
    return { success: false, error: 'Prompt is empty' };
  }
  if (!targetIds || targetIds.length === 0) {
    return { success: false, error: 'No target accounts selected' };
  }

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const accountId of targetIds) {
    // Add artificial network latency delay (300ms - 600ms) for high-fidelity feel
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

    // Deduct credits and update status
    const tx = relayBroadcast(accountId, costPerAccount);

    if (tx.success) {
      successCount++;
      results.push({
        accountId,
        success: true,
        cost: tx.cost,
        remainingCredits: tx.remainingCredits,
        status: tx.status,
        log: `[${new Date().toLocaleTimeString()}] ✓ Prompt broadcast successful. 1 credit charged.`,
      });
    } else {
      failureCount++;
      results.push({
        accountId,
        success: false,
        error: tx.error,
        log: `[${new Date().toLocaleTimeString()}] ✕ Broadcast failed: ${tx.error}`,
      });
    }
  }

  const summary = {
    id: 'fleet_' + Math.random().toString(36).slice(2, 10),
    prompt,
    successCount,
    failureCount,
    total: targetIds.length,
    results,
    timestamp: new Date().toISOString()
  };

  // Save to history log
  try {
    const raw = localStorage.getItem('agentflow_fleet_history');
    const history = raw ? JSON.parse(raw) : [];
    localStorage.setItem('agentflow_fleet_history', JSON.stringify([summary, ...history].slice(0, 50)));
  } catch (err) {
    console.warn("Failed to update fleet prompt history:", err);
  }

  return summary;
}

/**
 * Retrieves the history of fleet prompt executions.
 * @returns {object[]} History items
 */
export function getFleetHistory() {
  try {
    const raw = localStorage.getItem('agentflow_fleet_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
