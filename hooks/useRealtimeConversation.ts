import { useSocket } from "@/api/socketRegistry";
import type { ChatMessage, ChatMessageContentType } from "@/types/converstion";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { conversationKeys, sortAscending } from "./useConversations";

type IncomingBackendMessage = {
  id?: string;
  _id?: string;
  chatRoomId: string;
  sender?: {
    id?: string;
    _id?: string;
    username?: string;
    profilePicture?: string | null;
  } | null;
  content?: string;
  media?: string[];
  messageType?: "text" | "media" | "mixed" | "system";
  meta?: Record<string, unknown> | null;
  createdAt?: string | Date;
};

const normaliseIncomingMessage = (
  msg: IncomingBackendMessage,
  userId: string,
): ChatMessage => {
  const senderId = msg.sender?.id ?? msg.sender?._id ?? "unknown";
  const rawType = msg.messageType ?? "text";

  const kind = rawType === "system" ? "system" : "user";
  const contentType: ChatMessageContentType | undefined =
    rawType === "text" || rawType === "media" || rawType === "mixed"
      ? rawType
      : undefined;

  return {
    id: msg.id ?? msg._id ?? `temp-${Date.now()}`,
    chatRoomId: msg.chatRoomId,
    kind,
    contentType,
    sender: msg.sender
      ? {
          id: senderId,
          username: msg.sender.username ?? "Unknown",
          profilePicture: msg.sender.profilePicture ?? null,
        }
      : null,
    content: msg.content ?? "",
    media: msg.media ?? [],
    meta: msg.meta ?? null,
    createdAt: msg.createdAt
      ? new Date(msg.createdAt).toISOString()
      : new Date().toISOString(),
    isMine: senderId === userId,
  };
};

export function useRealtimeConversation(chatRoomId?: string, userId?: string) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const handleIncomingMessage = useCallback(
    (msg: IncomingBackendMessage) => {
      if (!chatRoomId || !userIdRef.current) return;
      if (msg.chatRoomId !== chatRoomId) return;

      const newMsg = normaliseIncomingMessage(msg, userIdRef.current);

      queryClient.setQueryData(
        conversationKeys.messages(chatRoomId),
        (old: any) => {
          if (!old?.pages?.length) {
            return {
              pages: [
                {
                  messages: [newMsg],
                  count: 1,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          const firstPage = old.pages[0];
          const safeMessages = firstPage.messages ?? [];

          const withoutTemp = safeMessages.filter((m: ChatMessage) => {
            if (m.id === newMsg.id) return false;

            if (
              m.id.startsWith("temp-") &&
              m.isMine &&
              newMsg.isMine &&
              m.content === newMsg.content
            ) {
              return false;
            }

            return true;
          });

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                messages: [...withoutTemp, newMsg].sort(sortAscending),
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: conversationKeys.inbox(),
      });
    },
    [chatRoomId, queryClient],
  );

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const joinRoom = () => socket.emit("chat:join", { chatRoomId });
    const leaveRoom = () => socket.emit("chat:leave", { chatRoomId });

    if (isConnected) joinRoom();

    socket.on("connect", joinRoom);
    socket.on("reconnect", joinRoom);
    socket.on("disconnect", leaveRoom);
    socket.on("chat:new_message", handleIncomingMessage);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("reconnect", joinRoom);
      socket.off("disconnect", leaveRoom);
      socket.off("chat:new_message", handleIncomingMessage);
      leaveRoom();
    };
  }, [socket, chatRoomId, isConnected, handleIncomingMessage]);
}
