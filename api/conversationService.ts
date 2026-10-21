import api from "@/api/api";
import type {
  ConversationDetail,
  ConversationMessagesResponse,
  InboxResponse,
} from "@/types/conversation";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const fetchInbox = async (): Promise<InboxResponse> => {
  const response = await api.get<ApiEnvelope<InboxResponse>>("/api/chat/inbox");
  return response.data.data;
};

export const fetchConversationDetail = async (
  chatRoomId: string,
): Promise<ConversationDetail> => {
  const inbox = await fetchInbox();
  const item = inbox.items.find((conversation) => conversation.chatRoomId === chatRoomId);
  if (!item) {
    throw new Error("Conversation not found. It may have no messages yet.");
  }

  return {
    conversation: {
      chatRoomId: item.chatRoomId,
      type: item.type,
      title: item.title,
      avatarUrl: item.avatarUrl,
      isMuted: item.isMuted,
    },
    ...(item.directMeta ? { directMeta: item.directMeta } : {}),
    ...(item.groupMeta ? { groupMeta: item.groupMeta } : {}),
  };
};

export const fetchConversationMessages = async ({
  chatRoomId,
  before,
  limit = 30,
}: {
  chatRoomId: string;
  before?: string;
  limit?: number;
}): Promise<ConversationMessagesResponse> => {
  const response = await api.get<ApiEnvelope<ConversationMessagesResponse>>(
    `/api/chat/conversations/${encodeURIComponent(chatRoomId)}/messages`,
    { params: { before, limit } },
  );
  return response.data.data;
};

export const sendConversationMessage = async ({
  chatRoomId,
  content,
  mediaIds = [],
}: {
  chatRoomId: string;
  content: string;
  mediaIds?: string[];
}) => {
  const response = await api.post<ApiEnvelope<{ message: unknown }>>(
    `/api/chat/conversations/${encodeURIComponent(chatRoomId)}/messages`,
    { content, attachmentIds: mediaIds },
  );
  return response.data.data.message;
};

export const markConversationRead = async (chatRoomId: string) => {
  const response = await api.post(
    `/api/chat/conversations/${encodeURIComponent(chatRoomId)}/read`,
  );
  return response.data;
};
