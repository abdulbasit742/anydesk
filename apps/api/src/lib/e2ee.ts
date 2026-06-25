import crypto from "crypto";

// This is a helper for the signaling server to facilitate E2EE
// The actual keys are generated on the client devices, the server only passes the public keys
// and signs them to prevent MITM attacks.

export class E2EESignaling {
  // Generate an ephemeral ECDH key pair for the server to sign the exchange
  static generateServerKeys() {
    const ecdh = crypto.createECDH("secp256k1");
    ecdh.generateKeys();
    return {
      publicKey: ecdh.getPublicKey("base64"),
      privateKey: ecdh.getPrivateKey("base64")
    };
  }

  // Sign a client's public key to prove it passed through the trusted server
  static signClientKey(clientPublicKey: string, serverPrivateKey: string): string {
    const sign = crypto.createSign("SHA256");
    sign.update(clientPublicKey);
    sign.end();
    
    // In a real app, we would use the actual private key buffer
    // For this implementation, we use HMAC as a simulation of a signature
    const hmac = crypto.createHmac("sha256", serverPrivateKey);
    hmac.update(clientPublicKey);
    return hmac.digest("hex");
  }

  // Verify a client's signature
  static verifyClientKey(clientPublicKey: string, signature: string, serverPrivateKey: string): boolean {
    const hmac = crypto.createHmac("sha256", serverPrivateKey);
    hmac.update(clientPublicKey);
    const expectedSignature = hmac.digest("hex");
    return signature === expectedSignature;
  }
}
