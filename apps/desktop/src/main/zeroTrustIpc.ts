import { ipcMain } from "electron";
import crypto from "crypto";
import os from "os";
import { execSync } from "child_process";

// ─── Device Fingerprinting ────────────────────────────────────────────────────

function getMacAddress(): string {
  try {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
      if (!iface) continue;
      for (const addr of iface) {
        if (!addr.internal && addr.mac && addr.mac !== "00:00:00:00:00:00") {
          return addr.mac;
        }
      }
    }
  } catch {}
  return "unknown";
}

function getHardwareId(): string {
  const platform = process.platform;
  try {
    if (platform === "win32") {
      const out = execSync("wmic csproduct get uuid", { encoding: "utf8", timeout: 5000 });
      const match = out.match(/[0-9A-F-]{36}/i);
      if (match) return match[0];
    } else if (platform === "darwin") {
      const out = execSync("ioreg -rd1 -c IOPlatformExpertDevice | awk '/IOPlatformUUID/ { print $3; }'", { encoding: "utf8", timeout: 5000 });
      return out.trim().replace(/"/g, "");
    } else if (platform === "linux") {
      try {
        const out = execSync("cat /etc/machine-id", { encoding: "utf8", timeout: 5000 });
        return out.trim();
      } catch {
        const out = execSync("cat /var/lib/dbus/machine-id", { encoding: "utf8", timeout: 5000 });
        return out.trim();
      }
    }
  } catch {}
  // Fallback: hash of MAC + hostname
  const mac = getMacAddress();
  const hostname = os.hostname();
  return crypto.createHash("sha256").update(`${mac}:${hostname}`).digest("hex");
}

function getSecureBootStatus(): boolean {
  const platform = process.platform;
  try {
    if (platform === "win32") {
      const out = execSync("powershell -command \"Confirm-SecureBootUEFI\"", { encoding: "utf8", timeout: 5000 });
      return out.trim().toLowerCase() === "true";
    } else if (platform === "linux") {
      const out = execSync("mokutil --sb-state 2>/dev/null || echo disabled", { encoding: "utf8", timeout: 5000 });
      return out.includes("SecureBoot enabled");
    }
  } catch {}
  return false;
}

function getTpmHash(): string | null {
  const platform = process.platform;
  try {
    if (platform === "win32") {
      const out = execSync("powershell -command \"Get-Tpm | Select-Object -ExpandProperty TpmPresent\"", { encoding: "utf8", timeout: 5000 });
      if (out.trim().toLowerCase() === "true") {
        // Generate a stable hash from hardware ID + TPM presence as a proxy
        const hwId = getHardwareId();
        return crypto.createHash("sha256").update(`tpm:${hwId}`).digest("hex");
      }
    }
  } catch {}
  return null;
}

// ─── E2EE Key Generation (ECDH) ──────────────────────────────────────────────

function generateECDHKeyPair(): { publicKey: string; privateKey: string } {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.generateKeys();
  return {
    publicKey: ecdh.getPublicKey("base64"),
    privateKey: ecdh.getPrivateKey("base64")
  };
}

function deriveSharedSecret(myPrivateKey: string, theirPublicKey: string): string {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(Buffer.from(myPrivateKey, "base64"));
  const sharedSecret = ecdh.computeSecret(Buffer.from(theirPublicKey, "base64"));
  // Derive a 32-byte AES-256 key using SHA-256
  return crypto.createHash("sha256").update(sharedSecret).digest("hex");
}

// ─── Session Watermarking ─────────────────────────────────────────────────────

function generateWatermarkData(userId: string, deviceId: string, sessionId: string): string {
  const payload = {
    u: userId.slice(0, 8),
    d: deviceId.slice(0, 8),
    s: sessionId.slice(0, 8),
    t: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

// ─── DLP Sensitive Data Detection ────────────────────────────────────────────

const DLP_PATTERNS = [
  { name: "Credit Card", pattern: /\b(?:\d[ -]?){13,16}\b/ },
  { name: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/ },
  { name: "Password", pattern: /(?:password|passwd|pwd)\s*[:=]\s*\S+/i },
  { name: "Private Key", pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { name: "AWS Key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Email + Password", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}:\S+/ }
];

function scanForSensitiveData(text: string): { detected: boolean; type?: string } {
  for (const { name, pattern } of DLP_PATTERNS) {
    if (pattern.test(text)) {
      return { detected: true, type: name };
    }
  }
  return { detected: false };
}

// ─── Certificate Pinning ──────────────────────────────────────────────────────

const PINNED_CERT_HASHES = new Set<string>();

function addPinnedCert(certPem: string): void {
  const hash = crypto.createHash("sha256").update(certPem).digest("hex");
  PINNED_CERT_HASHES.add(hash);
}

function verifyCertPin(certPem: string): boolean {
  if (PINNED_CERT_HASHES.size === 0) return true; // No pins configured, allow all
  const hash = crypto.createHash("sha256").update(certPem).digest("hex");
  return PINNED_CERT_HASHES.has(hash);
}

// ─── IPC Registration ─────────────────────────────────────────────────────────

export function registerZeroTrustIpc(): void {
  // Device fingerprint collection
  ipcMain.handle("security:get-device-fingerprint", async () => {
    const hardwareId = getHardwareId();
    const macAddress = getMacAddress();
    const secureBootEnabled = getSecureBootStatus();
    const tpmHash = getTpmHash();
    const osVersion = `${os.platform()} ${os.release()}`;

    return {
      hardwareId,
      macAddress,
      secureBootEnabled,
      tpmHash,
      osVersion,
      platform: process.platform
    };
  });

  // Secure boot verification
  ipcMain.handle("security:verify-secure-boot", async () => {
    return {
      enabled: getSecureBootStatus(),
      platform: process.platform
    };
  });

  // E2EE key pair generation
  ipcMain.handle("security:generate-ecdh-keypair", async () => {
    return generateECDHKeyPair();
  });

  // Derive shared AES-256 key from ECDH exchange
  ipcMain.handle("security:derive-shared-secret", async (_event, myPrivateKey: string, theirPublicKey: string) => {
    try {
      return { success: true, sharedSecret: deriveSharedSecret(myPrivateKey, theirPublicKey) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // AES-256-GCM encryption
  ipcMain.handle("security:encrypt", async (_event, plaintext: string, sharedSecret: string) => {
    const key = Buffer.from(sharedSecret.slice(0, 64), "hex");
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
      ciphertext: encrypted.toString("base64"),
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64")
    };
  });

  // AES-256-GCM decryption
  ipcMain.handle("security:decrypt", async (_event, ciphertext: string, iv: string, authTag: string, sharedSecret: string) => {
    try {
      const key = Buffer.from(sharedSecret.slice(0, 64), "hex");
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        Buffer.from(iv, "base64")
      );
      decipher.setAuthTag(Buffer.from(authTag, "base64"));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(ciphertext, "base64")),
        decipher.final()
      ]);
      return { success: true, plaintext: decrypted.toString("utf8") };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Session watermark generation
  ipcMain.handle("security:generate-watermark", async (_event, userId: string, deviceId: string, sessionId: string) => {
    return { watermark: generateWatermarkData(userId, deviceId, sessionId) };
  });

  // DLP clipboard scan
  ipcMain.handle("security:dlp-scan", async (_event, text: string) => {
    return scanForSensitiveData(text);
  });

  // Certificate pinning
  ipcMain.handle("security:pin-cert", async (_event, certPem: string) => {
    addPinnedCert(certPem);
    return { success: true };
  });

  ipcMain.handle("security:verify-cert-pin", async (_event, certPem: string) => {
    return { valid: verifyCertPin(certPem) };
  });
}
