// C:\Users\absh5\Documents\antigravity\fervent-planck\scripts\testSuite.js
// Automated test suite for AgentFlow core business logic services

import { encrypt, decrypt } from '../src/lib/crypto.js';
import { getPlan, setPlan, canDo, getLimit, checkAccountLimit } from '../src/lib/planGate.js';
import tokenCounter from '../src/lib/tokenCounter.js';
import { classifyPrompt } from '../src/lib/smartRouter.js';

// Setup Mock Environment for Web APIs in Node.js
globalThis.window = {
  crypto: globalThis.crypto
};

const storage = {};
globalThis.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { for (const k in storage) delete storage[k]; }
};

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

async function runTests() {
  console.log(`${colors.cyan}${colors.bold}=== AGENTFLOW INTEGRATED TEST SUITE ===${colors.reset}\n`);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
      passed++;
    } else {
      console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
      failed++;
    }
  }

  // =========================================================================
  // TEST SECTION 1: AES-256 Client-Side Encryption
  // =========================================================================
  console.log(`${colors.bold}1. Client-Side Cryptography (crypto.js)${colors.reset}`);
  try {
    const rawSecret = 'anthropic-secret-sk-1234567890';
    const password = 'my-master-password-123';
    
    const cipher = await encrypt(rawSecret, password);
    assert(typeof cipher === 'string' && cipher.length > 20, 'Encryption produces base64 payload');
    assert(cipher !== rawSecret, 'Encrypted output is obfuscated');

    const cleartext = await decrypt(cipher, password);
    assert(cleartext === rawSecret, 'Decrypted ciphertext matches original cleartext exactly');

    // Wrong password check
    try {
      await decrypt(cipher, 'wrong-password-456');
      assert(false, 'Decryption with wrong password should fail');
    } catch (e) {
      assert(true, 'Decryption with wrong password fails with error');
    }
  } catch (err) {
    console.error('Crypto test section threw unexpected error:', err);
    failed++;
  }
  console.log('');

  // =========================================================================
  // TEST SECTION 2: SaaS Plan Gating
  // =========================================================================
  console.log(`${colors.bold}2. SaaS Tier Plan Gating (planGate.js)${colors.reset}`);
  try {
    // Test Free Plan (default)
    localStorage.clear();
    assert(getPlan() === 'free', 'Default plan resolves to free');
    assert(canDo('fleet') === false, 'Free plan cannot perform fleet prompt broadcasts');
    assert(canDo('wall') === false, 'Free plan cannot render the multi-screen wall');
    assert(getLimit('accounts') === 2, 'Free plan limit is capped at 2 accounts');

    // Test account limit checks
    const limitCheckFree1 = checkAccountLimit(1);
    assert(limitCheckFree1.upgradeRequired === false, '1 account is within the free limit');
    
    const limitCheckFree2 = checkAccountLimit(2);
    assert(limitCheckFree2.upgradeRequired === true, '2 accounts triggers upgrade prompt on Free plan');

    // Test Pro Plan transition
    setPlan('pro');
    assert(getPlan() === 'pro', 'Plan updates to pro in storage');
    assert(canDo('fleet') === true, 'Pro plan can perform fleet prompt broadcasts');
    assert(canDo('wall') === true, 'Pro plan can render the multi-screen wall');
    assert(getLimit('accounts') === 25, 'Pro plan account limit is 25');

    const limitCheckPro = checkAccountLimit(24);
    assert(limitCheckPro.upgradeRequired === false, '24 accounts is within the Pro limit');

    const limitCheckProExceeded = checkAccountLimit(25);
    assert(limitCheckProExceeded.upgradeRequired === true, '25 accounts triggers upgrade prompt on Pro plan');

    // Test Agency Plan
    setPlan('agency');
    assert(getLimit('accounts') === 999, 'Agency plan account limit supports scale (999)');
  } catch (err) {
    console.error('Plan gating test section threw unexpected error:', err);
    failed++;
  }
  console.log('');

  // =========================================================================
  // TEST SECTION 3: Token Estimation
  // =========================================================================
  console.log(`${colors.bold}3. Word-Based Token Estimation (tokenCounter.js)${colors.reset}`);
  try {
    const text = 'Build a premium dark-mode dashboard with React and CSS variables.';
    
    // Baseline estimation
    const est = tokenCounter.estimate(text);
    // 10 words * 1.35 = 14 tokens
    assert(est === 14, 'Baseline estimation correctly scales word-based tokens');

    // Model specific estimation
    const haikuEst = tokenCounter.estimateForModel(text, 'claude-3-haiku');
    // 10 words * 1.38 = 14 tokens
    assert(haikuEst === 14, 'Model specific haiku multiplier behaves correctly');

    const opusEst = tokenCounter.estimateForModel(text, 'claude-3-opus');
    // 10 words * 1.40 = 14 tokens
    assert(opusEst === 14, 'Model specific opus multiplier behaves correctly');

    // Limits check
    const status = tokenCounter.checkLimit(text, 'gpt-4o');
    assert(status.count === 14, 'CheckLimit returns correct count');
    assert(status.safe === true, 'Under-limit check evaluates to safe');
    assert(status.estimatedCost > 0, 'Cost estimation calculations are positive');
    assert(tokenCounter.formatCount(1200) === '1.2K', 'Formatting utility handles thousands');
    assert(tokenCounter.formatCount(1500000) === '1.5M', 'Formatting utility handles millions');
  } catch (err) {
    console.error('Token counter test section threw unexpected error:', err);
    failed++;
  }
  console.log('');

  // =========================================================================
  // TEST SECTION 4: Intelligent Prompt Router
  // =========================================================================
  console.log(`${colors.bold}4. Intelligent Prompt Router (smartRouter.js)${colors.reset}`);
  try {
    // Test visual styling routing
    const uiPrompt = 'design a beautiful landing page for a SaaS platform using tailwind css components';
    const uiRoute = classifyPrompt(uiPrompt);
    assert(['lovable', 'v0'].includes(uiRoute.best), 'UI/CSS prompt classified as Lovable or v0');
    assert(uiRoute.recommendations[0].score > 10, 'Scores are scaled above default minimum');

    // Test backend / coding routing
    const devPrompt = 'write an express node background script that fetches data from postgres and saves it';
    const devRoute = classifyPrompt(devPrompt);
    assert(['replit', 'bolt'].includes(devRoute.best), 'Backend/Database prompt classified as Replit or Bolt');

    // Test autonomous workflows routing
    const agentPrompt = 'run an autonomous agent workflow that crawls websites and schedules cron jobs';
    const agentRoute = classifyPrompt(agentPrompt);
    assert(agentRoute.best === 'manus', 'Autonomous workflow prompt routed to Manus');
  } catch (err) {
    console.error('Router test section threw unexpected error:', err);
    failed++;
  }
  console.log('');

  // =========================================================================
  // SUMMARY RESULTS
  // =========================================================================
  console.log(`${colors.cyan}${colors.bold}=== TEST RUN SUMMARY ===${colors.reset}`);
  console.log(`Total Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`Total Failed: ${failed > 0 ? colors.red : colors.green}${failed}${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}${colors.bold}Status: RED (Failures detected)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}Status: GREEN (All tests passed!)${colors.reset}`);
    process.exit(0);
  }
}

runTests();
