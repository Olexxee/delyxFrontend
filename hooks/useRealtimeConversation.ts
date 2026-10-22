import { useSocket } from "@/api/socketRegistry";
import type {
  ChatMessage,
  ChatMessageContentType,
  ConversationDetail,
} from "@/types/conversation";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { conversationKeys, sortAscending } from "./useConversations";

type IncomingBackendMessage = {
  id?: string;
  _id?: string;
  chatRoomId?: string;
  communityId?: string;
  senderId?: string;
  receiverId?: string | null;
  sender?: {
    id?: string;
    _id?: string;
    username?: string;
    avatar?: string | null;
    profilePicture?: string | null;
  } | null;
  content?: string;
  media?: string[];
  attachments?: Array<{ url?: string }>;
  messageType?: "text" | "media" | "mixed" | "system";
  meta?: Record<string, unknown> | null;
  createdAt?: string | Date;
};

const normaliseIncomingMessage = (
  msg: IncomingBackendMessage,
  userId: string,
  chatRoomId: string,
): ChatMessage => {
  const senderId = msg.sender?.id ?? msg.sender?._id ?? msg.senderId ?? "unknown";
  const media = msg.media ?? (msg.attachments ?? []).map((item) => item.url).filter((url): url is string => Boolean(url));
  const rawType = msg.messageType ?? (media.length ? (msg.content ? "mixed" : "media") : "text");
  const kind = rawType === "system" ? "system" : "user";
  const contentType: ChatMessageContentType | undefined =
    rawType === "text" || rawType === "media" || rawType === "mixed"
      ? rawType
      : undefined;

  return {
    id: msg.id ?? msg._id ?? `temp-${Date.now()}`,
    chatRoomId,
    kind,
    contentType,
    sender: msg.sender
      ? {
          id: senderId,
          username: msg.sender.username ?? "Unknown",
          profilePicture: msg.sender.profilePicture ?? msg.sender.avatar ?? null,
        }
      : { id: senderId, username: "Unknown", profilePicture: null },
    content: msg.content ?? "",
    media,
    meta: (msg.meta as ChatMessage["meta"]) ?? null,
    createdAt: msg.createdAt
      ? new Date(msg.createdAt).toISOString()
      : new Date().toISOString(),
    isMine: senderId === userId,
  };
};

export function useRealtimeConversation(
  chatRoomId?: string,
  userId?: string,
  detail?: ConversationDetail,
) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const handleIncomingEvent = useCallback(
    (event: any) => {
      if (!chatRoomId || !userIdRef.current || event?.type !== "message:new") return;
      if (detail?.conversation.type === "group") {
        if (event.scope !== "community" || event.communityId !== (detail.groupMeta?.groupId ?? chatRoomId)) return;
      } else if (detail?.conversation.type === "direct") {
        const otherUserId = detail.directMeta?.userId;
        const message = event.message as IncomingBackendMessage | undefined;
        if (
          event.scope !== "direct" ||
          !message ||
          !otherUserId ||
          ![message.senderId, message.receiverId].includes(otherUserId)
        ) return;
      } else {
        return;
      }

      const rawMessage = event.message as IncomingBackendMessage | undefined;
      if (!rawMessage) return;
      const newMsg = normaliseIncomingMessage(
        rawMessage,
        userIdRef.current,
        chatRoomId,
      );

      queryClient.setQueryData(
        conversationKeys.messages(chatRoomId),
        (old: any) => {
          if (!old?.pages?.length) {
            return {
              pages: [{ messages: [newMsg], count: 1, hasMore: false }],
              pageParams: [undefined],
            };
          }

          const firstPage = old.pages[0];
          const safeMessages = firstPage.messages ?? [];
          const withoutDuplicate = safeMessages.filter((message: ChatMessage) => {
            if (message.id === newMsg.id) return false;
            return !(
              message.id.startsWith("temp-") &&
              message.isMine &&
              newMsg.isMine &&
              message.content === newMsg.content
            );
          });

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                messages: [...withoutDuplicate, newMsg].sort(sortAscending),
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: conversationKeys.inbox() });
    },
    [chatRoomId, detail, queryClient],
  );

  useEffect(() => {
    if (!socket || !chatRoomId || !detail) return;

    const subscribe = () => {
      if (detail.conversation.type === "group") {
        const communityId = detail.groupMeta?.groupId ?? chatRoomId;
        socket.emit("subscribe:community", { communityId });
      } else if (detail.directMeta?.userId) {
        socket.emit("subscribe:direct", { userId: detail.directMeta.userId });
      }
    };

    if (isConnected) subscribe();
    socket.on("connect", subscribe);
    socket.on("reconnect", subscribe);
    socket.on("message:new", handleIncomingEvent);

    return () => {
      socket.off("connect", subscribe);
      socket.off("reconnect", subscribe);
      socket.off("message:new", handleIncomingEvent);
    };
  }, [socket, chatRoomId, detail, isConnected, handleIncomingEvent]);
}
