import crypto from "crypto";
export const encryptionService = {
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 4096, publicKeyEncoding: { type: "spki", format: "pem" }, privateKeyEncoding: { type: "pkcs8", format: "pem" } });
    return { publicKey, privateKey };
  },
  encrypt(data: string, publicKey: string): string {
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
    return encrypted.toString("base64");
  },
  decrypt(encryptedData: string, privateKey: string): string {
    const decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, "base64"));
    return decrypted.toString("utf8");
  },
  symmetricEncrypt(data: string, key: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return { encrypted: encrypted + authTag, iv: iv.toString("hex") };
  },
  symmetricDecrypt(encrypted: string, key: string, iv: string): string {
    const authTag = Buffer.from(encrypted.slice(-32), "hex");
    const data = encrypted.slice(0, -32);
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
  hashPassword(password: string): Promise<string> { return new Promise((resolve) => { const salt = crypto.randomBytes(16).toString("hex"); crypto.scrypt(password, salt, 64, (err, key) => { resolve(`${salt}:${key.toString("hex")}`); }); }); },
  verifyPassword(password: string, hash: string): Promise<boolean> { return new Promise((resolve) => { const [salt, key] = hash.split(":"); crypto.scrypt(password, salt, 64, (err, derivedKey) => { resolve(key === derivedKey.toString("hex")); }); }); },
};
