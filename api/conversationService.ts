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
  const response = await api.get<ApiEnvelope<InboxResponse>>(
    "/conversations/inbox",
  );
  return response.data.data;
};

export const fetchConversationDetail = async (
  chatRoomId: string,
): Promise<ConversationDetail> => {
  const response = await api.get<ApiEnvelope<ConversationDetail>>(
    `/conversations/${chatRoomId}`,
  );
  return response.data.data;
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
    `/chats/room/${chatRoomId}/messages`,
    { params: { before, limit } },
  );

  console.log("raw response.data:", JSON.stringify(response.data, null, 2));
  console.log("unwrapped:", JSON.stringify(response.data.data, null, 2));

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
  const response = await api.post(`/chats/room/${chatRoomId}/messages`, {
    content,
    mediaIds,
  });
  return response.data.data.message;
};

export const markConversationRead = async (chatRoomId: string) => {
  const response = await api.post(`/chats/room/${chatRoomId}/read`);
  return response.data;
};
