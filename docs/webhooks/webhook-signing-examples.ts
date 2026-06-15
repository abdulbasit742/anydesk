/**
 * Webhook Signing Examples
 */

import { createHmac, timingSafeEqual } from "crypto";

/**
 * Generate webhook signature
 */
export function signPayload(payload: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `sha256=${signature}`;
}

/**
 * Verify webhook signature (constant-time comparison)
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = signPayload(payload, secret);
  
  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

// Express middleware example
import express from "express";

export function webhookAuth(secret: string): express.RequestHandler {
  return (req, res, next) => {
    const signature = req.headers["x-webhook-signature"] as string;
    
    if (!signature) {
      return res.status(401).json({ error: "Missing signature" });
    }
    
    const payload = JSON.stringify(req.body);
    if (!verifySignature(payload, signature, secret)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    
    next();
  };
}

// Python example
/*
import hmac
import hashlib

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
*/

// Go example
/*
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "strings"
)

func verifySignature(payload []byte, signature string, secret string) bool {
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(payload)
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(expected), []byte(signature))
}
*/
