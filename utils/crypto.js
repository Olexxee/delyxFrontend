import crypto from 'react-native-quick-crypto';

/**
 * Encrypts using AES-256-GCM (Fast & Secure)
 * Matches Backend: { encryptedContent, iv, authTag }
 */
export const encryptMessage = (plainText, aesKeyHex) => {
  try {
    const key = Buffer.from(aesKeyHex, 'hex');
    const iv = crypto.randomBytes(12); // GCM standard IV length is 12 bytes

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedContent: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag,
    };
  } catch (e) {
    console.error("Quick-Crypto Encryption error:", e);
    return { encryptedContent: plainText, iv: null, authTag: null };
  }
};

/**
 * Decrypts AES-256-GCM
 */
export const decryptMessage = (messageObj, aesKeyHex) => {
  try {
    const { encryptedContent, iv, authTag } = messageObj;
    if (!encryptedContent || !iv || !authTag) return messageObj.content || "";

    const key = Buffer.from(aesKeyHex, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const tagBuffer = Buffer.from(authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(tagBuffer);

    let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (e) {
    console.error("Quick-Crypto Decryption error:", e);
    return "[Encrypted Message]";
  }
};