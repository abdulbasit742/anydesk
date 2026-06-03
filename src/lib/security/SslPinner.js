// SslPinner.js — Simulated SSL validation sweeping cert details to prevent MITM
const KNOWN_FINGERPRINTS = {
  'bolt.new': ['sha256/ABC123...', 'sha256/DEF456...'],
  'lovable.dev': ['sha256/GHI789...'],
  'claude.ai': ['sha256/JKL012...'],
  'replit.com': ['sha256/MNO345...'],
};

export class SslPinner {
  constructor(onLog) {
    this.onLog = onLog || (() => {});
    this.pinStore = { ...KNOWN_FINGERPRINTS };
    this.violations = [];
  }

  async validateConnection(domain) {
    this._log('info', `[SSL] Validating certificate for ${domain}...`);
    await this._delay(100 + Math.random() * 100);

    const cert = await this._fetchSimulatedCert(domain);

    const pinned = this.pinStore[domain];
    const pinMatch = !pinned || pinned.includes(cert.fingerprint);

    if (!pinMatch) {
      const violation = { domain, cert, ts: Date.now(), type: 'pin_mismatch' };
      this.violations.push(violation);
      this._log('error', `[SSL] CERTIFICATE PIN MISMATCH for ${domain} — POSSIBLE MITM ATTACK`);
      return { valid: false, violation };
    }

    if (new Date(cert.expiresAt) < new Date()) {
      this._log('warn', `[SSL] Certificate for ${domain} has expired`);
      return { valid: false, cert, reason: 'expired' };
    }

    const daysUntilExpiry = Math.round((new Date(cert.expiresAt) - Date.now()) / 86400000);
    if (daysUntilExpiry < 30) {
      this._log('warn', `[SSL] Certificate for ${domain} expires in ${daysUntilExpiry} days`);
    }

    this._log('success', `[SSL] Certificate valid for ${domain} (${cert.protocol}, expires ${daysUntilExpiry}d)`);
    return { valid: true, cert, daysUntilExpiry };
  }

  async _fetchSimulatedCert(domain) {
    return {
      domain,
      fingerprint: (this.pinStore[domain] || ['sha256/MOCK_VALID'])[0],
      protocol: 'TLS 1.3',
      issuer: 'Let\'s Encrypt Authority X3',
      issuedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
    };
  }

  addPin(domain, fingerprint) { this.pinStore[domain] = [...(this.pinStore[domain] || []), fingerprint]; }
  getViolations() { return [...this.violations]; }
  _log(level, message) { this.onLog({ level, message, ts: Date.now() }); }
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}
