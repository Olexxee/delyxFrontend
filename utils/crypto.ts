export interface EncryptedMessagePayload {
  encryptedContent?: string;
  content?: string;
}

/**
 * Frontend-safe "decryption".
 * Backend is the source of truth.
 * Never throws. Never crashes.
 */
export const decryptMessage = (payload: EncryptedMessagePayload): string => {
  if (!payload) return "";

  if (typeof payload.content === "string") {
    return payload.content;
  }

  if (typeof payload.encryptedContent === "string") {
    return "[Encrypted Message]";
  }

  return "";
};
