import { useEffect, useCallback, useMemo } from "react";
import { useSocket } from "@/api/socketRegistry";
import { getChatMessages, getGroupAESKey } from "@/api/apiService";
import { decryptMessage, EncryptedMessagePayload } from "@/utils/crypto";
import { useAsyncState } from "@/utils/useAsyncState";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export interface BackendMessage {
  _id: string;
  chatRoomId: string;
  sender?: { _id: string; username?: string };
  encryptedContent?: string;
  content?: string;
  media?: any[];
  createdAt?: string;
}

export interface ChatMessage {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: { _id: string; username: string };
  media?: any[];
  createdAt: string;
  isMe: boolean;
}

/* ---------------------------------- */
/* Hook                               */
/* ---------------------------------- */

export function useChatEngine(chatRoomId: string, userId: string) {
  const { socket, isConnected } = useSocket();

  const {
    data: messages,
    setData: setMessages,
    loading,
    run,
  } = useAsyncState<ChatMessage[]>();

  /* =========================================================
     1️⃣ Hydration (Key + History)
  ========================================================== */

  useEffect(() => {
    if (!chatRoomId) return;

    const hydrate = async (): Promise<ChatMessage[]> => {
      const [keyRes, msgRes] = await Promise.all([
        getGroupAESKey(chatRoomId),
        getChatMessages(chatRoomId),
      ]);

      const key = keyRes?.aesKey ?? null;

      const hydrated: ChatMessage[] = Array.isArray(msgRes?.data)
        ? msgRes.data.map((msg: BackendMessage) => {
            const payload: EncryptedMessagePayload = {
              encryptedContent: msg.encryptedContent,
              content: msg.content,
            };

            const content = key
              ? decryptMessage(payload)
              : msg.content || "";

            return {
              _id: msg._id,
              chatRoomId: msg.chatRoomId,
              content,
              sender: {
                _id: msg.sender?._id || "unknown",
                username: msg.sender?.username || "Unknown",
              },
              media: msg.media || [],
              createdAt: msg.createdAt || new Date().toISOString(),
              isMe: msg.sender?._id === userId,
            };
          })
        : [];

      hydrated.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

      return hydrated;
    };

    run(hydrate());
  }, [chatRoomId, userId, run]);

  /* =========================================================
     2️⃣ Room Join / Leave Lifecycle
  ========================================================== */

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const join = () => socket.emit("chat:join", { chatRoomId });
    const leave = () => socket.emit("chat:leave", { chatRoomId });

    if (isConnected) join();

    socket.on("connect", join);
    socket.on("reconnect", join);
    socket.on("disconnect", leave);

    return () => {
      socket.off("connect", join);
      socket.off("reconnect", join);
      socket.off("disconnect", leave);
      leave();
    };
  }, [socket, chatRoomId, isConnected]);

  /* =========================================================
     3️⃣ Incoming Message Handler (Stable)
  ========================================================== */

  const handleIncomingMessage = useCallback(
    (msg: BackendMessage) => {
      if (msg.chatRoomId !== chatRoomId) return;

      const payload: EncryptedMessagePayload = {
        encryptedContent: msg.encryptedContent,
        content: msg.content,
      };

      const content = msg.encryptedContent
        ? decryptMessage(payload)
        : msg.content || "";

      const newMsg: ChatMessage = {
        _id: msg._id,
        chatRoomId: msg.chatRoomId,
        content,
        sender: {
          _id: msg.sender?._id || "unknown",
          username: msg.sender?.username || "Unknown",
        },
        media: msg.media || [],
        createdAt: msg.createdAt || new Date().toISOString(),
        isMe: msg.sender?._id === userId,
      };

      setMessages((prev) => {
        const safePrev = prev ?? [];
        if (safePrev.some((m) => m._id === newMsg._id)) return prev;

        const merged = [...safePrev, newMsg];

        merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );

        return merged;
      });
    },
    [chatRoomId, userId, setMessages]
  );

  /* =========================================================
     4️⃣ Subscribe to Incoming Messages
  ========================================================== */

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:new_message", handleIncomingMessage);

    return () => {
      socket.off("chat:new_message", handleIncomingMessage);
    };
  }, [socket, handleIncomingMessage]);

  /* =========================================================
     5️⃣ Send Message
  ========================================================== */

  const sendMessage = useCallback(
    (content: string, mediaIds: string[] = []) => {
      if (!socket || !chatRoomId) return;

      socket.emit(
        "chat:send",
        { chatRoomId, content, mediaIds },
        (ack: any) => {
          if (!ack?.success) {
            console.error("Message send failed:", ack?.error);
          }
        }
      );
    },
    [socket, chatRoomId]
  );

  /* ========================================================= */

  return useMemo(
    () => ({
      messages: messages ?? [],
      setMessages,
      loading,
      sendMessage,
      isConnected,
    }),
    [messages, setMessages, loading, sendMessage, isConnected]
  );
}
