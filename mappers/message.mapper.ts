import type { ChatMessage } from "@/types/converstion";
import type { ChatMessageVM } from "@/view-models/message.vm";
import { normalizeNullableString } from "./mapper.utils";

export function mapChatMessageToVM(
  message: ChatMessage,
  currentUserId?: string | null,
): ChatMessageVM {
  if (message.kind === "system") {
    const tournamentId = normalizeNullableString(message.meta?.tournamentId);

    return {
      kind: "system",
      id: message.id,
      content: message.content?.trim() || "",
      createdAt: message.createdAt,
      action: tournamentId
        ? {
            type: "open_tournament",
            tournamentId,
            label: "View",
          }
        : null,
    };
  }

  const senderId = message.sender?.id ?? null;

  return {
    kind: "user",
    id: message.id,
    content: normalizeNullableString(message.content),
    mediaCount: Array.isArray(message.media) ? message.media.length : 0,
    isMine:
      Boolean(message.isMine) ||
      Boolean(currentUserId && senderId && senderId === currentUserId),
    senderName: normalizeNullableString(message.sender?.username),
    createdAt: message.createdAt,
    deliveryState: "sent",
  };
}