// MfaVerifier.js — Simulated multi-factor verification gate for credential updates
export class MfaVerifier {
  constructor(options = {}) {
    this.method = options.method || 'totp';
    this.onLog = options.onLog || (() => {});
    this._pendingCode = null;
    this._codeExpiry = null;
  }

  async requestCode(userId) {
    this._log('info', `[MFA] Sending verification code to ${this.method} for user ${userId}`);
    await this._delay(300 + Math.random() * 200);

    // Generate simulated 6-digit code
    this._pendingCode = String(Math.floor(100000 + Math.random() * 900000));
    this._codeExpiry = Date.now() + 5 * 60 * 1000;

    this._log('success', `[MFA] Code sent via ${this.method}`);
    return {
      sent: true,
      method: this.method,
      expiresAt: this._codeExpiry,
      maskedDestination: this._getMaskedDestination(),
    };
  }

  async verify(inputCode) {
    await this._delay(100 + Math.random() * 150);

    if (!this._pendingCode) {
      this._log('error', '[MFA] No pending verification code');
      return { verified: false, reason: 'No code requested' };
    }

    if (Date.now() > this._codeExpiry) {
      this._pendingCode = null;
      this._log('warn', '[MFA] Code expired');
      return { verified: false, reason: 'Code expired' };
    }

    const valid = String(inputCode).trim() === this._pendingCode;
    this._pendingCode = null;

    if (valid) {
      this._log('success', '[MFA] Verification successful');
      return { verified: true, token: `mfa_${Math.random().toString(36).slice(2, 14)}`, expiresIn: 3600 };
    }

    this._log('error', '[MFA] Invalid code');
    return { verified: false, reason: 'Invalid code' };
  }

  _getMaskedDestination() {
    if (this.method === 'email') return '***@***.com';
    if (this.method === 'sms') return '+1 *** *** **89';
    return 'Authenticator App';
  }

  _log(level, message) { this.onLog({ level, message, ts: Date.now() }); }
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}
