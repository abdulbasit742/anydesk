#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const files = [
  'README.md',
  'src/pages/RemoteDesktop/RemoteHome.jsx',
  'src/pages/RemoteDesktop/RemoteSession.jsx',
  'src/security/remoteSessionPolicy.js',
];
const findings = [];

function report(file, rule, detail) {
  findings.push({ file, rule, detail });
}

for (const file of files) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    report(file, 'missing-file', 'required consent-first remote-support file is missing');
    continue;
  }
  const text = fs.readFileSync(absolute, 'utf8');
  const secretPatterns = [
    /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  ];
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) report(file, 'credential-pattern', 'credential-shaped value found');
    pattern.lastIndex = 0;
  }
}

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readme = fs.existsSync(path.join(root, 'README.md')) ? read('README.md') : '';
const home = fs.existsSync(path.join(root, 'src/pages/RemoteDesktop/RemoteHome.jsx')) ? read('src/pages/RemoteDesktop/RemoteHome.jsx') : '';
const session = fs.existsSync(path.join(root, 'src/pages/RemoteDesktop/RemoteSession.jsx')) ? read('src/pages/RemoteDesktop/RemoteSession.jsx') : '';
const policy = fs.existsSync(path.join(root, 'src/security/remoteSessionPolicy.js')) ? read('src/security/remoteSessionPolicy.js') : '';

const prohibitedClaims = [
  /mock a physical webcam/i,
  /identity verification platforms?/i,
  /webcam spoof/i,
  /bypass (?:identity|verification)/i,
  /zero stream setup delay/i,
];
for (const pattern of prohibitedClaims) {
  if (pattern.test(readme)) report('README.md', 'unsafe-or-stale-claim', `prohibited claim matched ${pattern}`);
}

if (!/consent-first/i.test(readme) || !/transport is not implemented/i.test(readme)) {
  report('README.md', 'truthful-boundary', 'README must state consent-first design and absent transport');
}
if (!/Prototype boundary/.test(home) || !/no device discovery/.test(home)) {
  report('src/pages/RemoteDesktop/RemoteHome.jsx', 'prototype-disclosure', 'overview must disclose disabled remote capabilities');
}
if (/Math\.random|setInterval|\bconnected\b\s*\?\s*['"]● Live/i.test(session)) {
  report('src/pages/RemoteDesktop/RemoteSession.jsx', 'fake-live-state', 'remote session UI must not fabricate live telemetry');
}
if (/getUserMedia|getDisplayMedia|RTCPeerConnection|navigator\.mediaDevices\s*=|sendInput|executeShell/i.test(session)) {
  report('src/pages/RemoteDesktop/RemoteSession.jsx', 'unreviewed-transport', 'transport, media capture, input, and shell APIs are disabled in this baseline');
}
for (const required of ['hostConfirmed', 'highRiskConfirmed', 'createSupportRequest', 'startLocalPreview']) {
  if (!session.includes(required)) report('src/pages/RemoteDesktop/RemoteSession.jsx', 'consent-flow', `missing ${required}`);
}
for (const required of ["transport: 'not_configured'", 'MAX_TTL_MINUTES = 15', 'HIGH_RISK_SCOPES', 'ALLOWED_TRANSITIONS']) {
  if (!policy.includes(required)) report('src/security/remoteSessionPolicy.js', 'policy-boundary', `missing ${required}`);
}

if (findings.length) {
  console.error(`Remote-support security check failed with ${findings.length} finding(s):`);
  for (const finding of findings) console.error(`- ${finding.file} [${finding.rule}]: ${finding.detail}`);
  process.exit(1);
}

console.log(`Remote-support security check passed for ${files.length} active files.`);
