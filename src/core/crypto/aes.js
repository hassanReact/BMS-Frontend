import { randomBytes, createCipheriv } from 'crypto';

export function encryptWithAESKey(plaintext, aesKey) {
  const key = Buffer.isBuffer(aesKey) ? aesKey : Buffer.from(aesKey, 'hex');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}
