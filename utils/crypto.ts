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

export const encryptMessage = (content: string): EncryptedMessagePayload => {
  // Placeholder encryption logic
  // In a real app, this would call a native module or use a library to encrypt the content
  return {
    encryptedContent: `encrypted(${content})`,
  };
};
