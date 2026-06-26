import { contextBridge, ipcRenderer } from "electron";

export function exposeZeroTrustApi() {
  contextBridge.exposeInMainWorld("zeroTrust", {
    // Device Fingerprinting
    getDeviceFingerprint: () =>
      ipcRenderer.invoke("security:get-device-fingerprint") as Promise<{
        hardwareId: string;
        macAddress: string;
        secureBootEnabled: boolean;
        tpmHash: string | null;
        osVersion: string;
        platform: string;
      }>,

    verifySecureBoot: () =>
      ipcRenderer.invoke("security:verify-secure-boot") as Promise<{
        enabled: boolean;
        platform: string;
      }>,

    // E2EE Key Exchange
    generateECDHKeypair: () =>
      ipcRenderer.invoke("security:generate-ecdh-keypair") as Promise<{
        publicKey: string;
        privateKey: string;
      }>,

    deriveSharedSecret: (myPrivateKey: string, theirPublicKey: string) =>
      ipcRenderer.invoke("security:derive-shared-secret", myPrivateKey, theirPublicKey) as Promise<{
        success: boolean;
        sharedSecret?: string;
        error?: string;
      }>,

    // AES-256-GCM Encryption
    encrypt: (plaintext: string, sharedSecret: string) =>
      ipcRenderer.invoke("security:encrypt", plaintext, sharedSecret) as Promise<{
        ciphertext: string;
        iv: string;
        authTag: string;
      }>,

    decrypt: (ciphertext: string, iv: string, authTag: string, sharedSecret: string) =>
      ipcRenderer.invoke("security:decrypt", ciphertext, iv, authTag, sharedSecret) as Promise<{
        success: boolean;
        plaintext?: string;
        error?: string;
      }>,

    // Session Watermarking
    generateWatermark: (userId: string, deviceId: string, sessionId: string) =>
      ipcRenderer.invoke("security:generate-watermark", userId, deviceId, sessionId) as Promise<{
        watermark: string;
      }>,

    // DLP
    dlpScan: (text: string) =>
      ipcRenderer.invoke("security:dlp-scan", text) as Promise<{
        detected: boolean;
        type?: string;
      }>,

    // Certificate Pinning
    pinCert: (certPem: string) =>
      ipcRenderer.invoke("security:pin-cert", certPem) as Promise<{ success: boolean }>,

    verifyCertPin: (certPem: string) =>
      ipcRenderer.invoke("security:verify-cert-pin", certPem) as Promise<{ valid: boolean }>
  });
}
