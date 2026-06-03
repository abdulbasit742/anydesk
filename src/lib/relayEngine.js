// src/lib/relayEngine.js
// Handles credit deduction logic, status updates, and automated handoffs across active accounts

import { getAccount, updateAccount, getAccounts } from './accountStore';

/**
 * Executes a simulated credit relay / consumption transaction.
 * Deducts credit cost from the account and updates its status accordingly.
 * 
 * @param {string} accountId - ID of the target platform account
 * @param {number} baseCost - Base cost in credits per prompt run (default 1)
 * @returns {object} Result of the relay run
 */
export function relayBroadcast(accountId, baseCost = 1) {
  const account = getAccount(accountId);
  
  if (!account) {
    return { success: false, error: `Account with ID ${accountId} not found.` };
  }
  
  if (account.status === 'expired_session') {
    return { success: false, error: `Account session expired. Reconnect required.`, account };
  }
  
  if (account.status === 'inactive' || account.status === 'paused') {
    return { success: false, error: `Account is currently inactive or paused.`, account };
  }

  const currentBalance = account.creditBalance !== undefined ? account.creditBalance : account.credits;
  
  if (currentBalance <= 0) {
    updateAccount(accountId, { status: 'exhausted', creditBalance: 0 });
    return { success: false, error: `Relay failed: Account has exhausted all credits.`, account: { ...account, status: 'exhausted', creditBalance: 0 } };
  }

  // Deduct credits
  const finalCost = Math.min(currentBalance, baseCost);
  const nextBalance = currentBalance - finalCost;
  
  // Determine new health/status based on threshold rules
  let nextStatus = 'active';
  const limit = account.creditLimit || 30;
  if (nextBalance <= 0) {
    nextStatus = 'exhausted';
  } else if (nextBalance < (0.2 * limit)) {
    nextStatus = 'low_credits';
  }

  const updatedFields = {
    creditBalance: nextBalance,
    credits: nextBalance, // maintain compatibility with both keys
    status: nextStatus,
    broadcastCount: (account.broadcastCount || 0) + 1,
    lastUsed: new Date().toISOString()
  };

  const updatedAccount = updateAccount(accountId, updatedFields);
  
  return {
    success: true,
    cost: finalCost,
    remainingCredits: nextBalance,
    status: nextStatus,
    account: updatedAccount
  };
}

/**
 * Finds the best active account with the highest credit balance.
 * Optionally excludes a specific account ID (e.g. the one that was just exhausted).
 * 
 * @param {object} options
 * @param {string} options.excludeId
 * @returns {object|null} The chosen account or null
 */
export function selectBestAccount({ excludeId } = {}) {
  const accounts = getAccounts();
  const candidates = accounts.filter(a => 
    a.status === 'active' && 
    a.id !== excludeId && 
    (a.creditBalance !== undefined ? a.creditBalance : a.credits) > 0
  );
  
  if (candidates.length === 0) return null;
  
  return candidates.sort((a, b) => {
    const balA = a.creditBalance !== undefined ? a.creditBalance : a.credits;
    const balB = b.creditBalance !== undefined ? b.creditBalance : b.credits;
    return balB - balA;
  })[0];
}

/**
 * Run a multi-step credit relay handoff simulation.
 * Updates state as it executes.
 */
export async function runCreditRelay(options = {}) {
  const {
    accounts = [],
    goal = 'N/A',
    buffer = 2,
    maxStepsPerAccount = 3,
    updateAccount: updateAccountCallback,
    addBroadcast: addBroadcastCallback,
    onLog = () => {},
    onProgress = () => {}
  } = options;

  onLog("[SYS-START] Initiating Credit Relay Handoff Chain...");
  await new Promise(r => setTimeout(r, 500));
  
  const activeAccs = accounts.filter(a => a.status === 'active' && (a.creditBalance !== undefined ? a.creditBalance : a.credits) > buffer);
  
  if (activeAccs.length === 0) {
    throw new Error("No active accounts found with credits above the buffer threshold.");
  }

  onLog(`[SYS] Detected ${activeAccs.length} candidate accounts above keep-buffer threshold.`);
  const steps = [];

  for (let i = 0; i < activeAccs.length; i++) {
    const acc = activeAccs[i];
    onLog(`[RELAY] Shifting execution context to: ${acc.name} (${acc.platform})...`);
    await new Promise(r => setTimeout(r, 600));

    // Determine random steps count and total credit cost
    const stepsCount = Math.floor(1 + Math.random() * (maxStepsPerAccount - 1 + 1));
    let creditsUsed = 0;

    for (let s = 1; s <= stepsCount; s++) {
      const stepCost = 1 + Math.floor(Math.random() * 2);
      creditsUsed += stepCost;
      onLog(`  -> Step ${s}: Dispatching workspace chunk on ${acc.platform}... consumed ${stepCost} cr`);
      await new Promise(r => setTimeout(r, 400));
    }

    const startingBalance = acc.creditBalance !== undefined ? acc.creditBalance : acc.credits;
    const remainingCredits = Math.max(0, startingBalance - creditsUsed);
    
    let nextStatus = 'active';
    const limit = acc.creditLimit || 30;
    if (remainingCredits <= 0) {
      nextStatus = 'exhausted';
    } else if (remainingCredits < (0.2 * limit)) {
      nextStatus = 'low_credits';
    }

    const updatedFields = {
      creditBalance: remainingCredits,
      credits: remainingCredits,
      status: nextStatus,
      broadcastCount: (acc.broadcastCount || 0) + 1,
      lastUsed: new Date().toISOString()
    };

    if (updateAccountCallback) {
      updateAccountCallback(acc.id, updatedFields);
    } else {
      updateAccount(acc.id, updatedFields);
    }

    if (addBroadcastCallback) {
      addBroadcastCallback({
        id: 'bc_' + Math.random().toString(36).slice(2, 10),
        accountId: acc.id,
        accountName: acc.name,
        platform: acc.platform,
        prompt: `Relay Step: ${goal}`,
        status: 'success',
        creditsUsed,
        createdAt: new Date().toISOString()
      });
    }

    const stepResult = {
      step: i + 1,
      accountId: acc.id,
      accountNickname: acc.name,
      platform: acc.platform,
      creditsUsed,
      estimatedRemainingCredits: remainingCredits,
      success: true
    };
    
    steps.push(stepResult);
    onProgress(i, steps);
    onLog(`[RELAY] Context shift successful. ${acc.name} final balance: ${remainingCredits} cr.`);
    await new Promise(r => setTimeout(r, 500));
  }

  const summary = `Relay chain complete across ${activeAccs.length} account(s)`;
  const nextPrompt = `// AgentFlow Credit Relay Handoff File\n// Goal: ${goal}\n// Remaining active nodes have buffered credits. System ready.\n`;

  const runResult = {
    runId: 'run_' + Math.random().toString(36).slice(2, 10),
    goal,
    minCreditsToKeep: buffer,
    steps,
    summary,
    nextPrompt,
    accountsUsed: activeAccs.length,
    creditsUsed: steps.reduce((sum, s) => sum + s.creditsUsed, 0),
    createdAt: new Date().toISOString()
  };

  // Persist run history
  try {
    const historyRaw = localStorage.getItem('antigravity_relay_history');
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    localStorage.setItem('antigravity_relay_history', JSON.stringify([runResult, ...history].slice(0, 50)));
  } catch (err) {
    console.warn("Failed to persist relay history:", err);
  }

  // Update logs and general stats
  try {
    const logsRaw = localStorage.getItem('agentflow_relay_log');
    const logs = logsRaw ? JSON.parse(logsRaw) : [];
    localStorage.setItem('agentflow_relay_log', JSON.stringify([runResult, ...logs].slice(0, 50)));

    const statsRaw = localStorage.getItem('agentflow_relay_stats');
    const stats = statsRaw ? JSON.parse(statsRaw) : { totalRelays: 0, totalCreditsConsumed: 0 };
    stats.totalRelays += 1;
    stats.totalCreditsConsumed += runResult.creditsUsed;
    localStorage.setItem('agentflow_relay_stats', JSON.stringify(stats));
  } catch (err) {
    console.warn("Failed to update general relay logs:", err);
  }

  onLog("[SYS-END] Credit relay chain execution completed successfully.");
  return runResult;
}

/** Get the list of all historic run logs */
export function getRelayLog() {
  try {
    const raw = localStorage.getItem('agentflow_relay_log');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Get aggregated relay stats */
export function getRelayStats() {
  try {
    const raw = localStorage.getItem('agentflow_relay_stats');
    return raw ? JSON.parse(raw) : { totalRelays: 0, totalCreditsConsumed: 0 };
  } catch {
    return { totalRelays: 0, totalCreditsConsumed: 0 };
  }
}
