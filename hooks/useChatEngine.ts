import { getChatMessages } from "@/api/apiService";
import { useSocket } from "@/api/socketRegistry";
import { useAsyncState } from "@/utils/useAsyncState";
import { useCallback, useEffect, useMemo, useRef } from "react";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export interface BackendMessage {
  _id: string;
  chatRoomId: string;
  sender?: { _id: string; username?: string; profilePicture?: string } | null;
  content?: string;
  media?: string[];
  createdAt?: string | Date;
}

export interface ChatMessage {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: { _id: string; username: string; profilePicture?: string };
  media: string[];
  createdAt: string;
  isMe: boolean;
}

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function normaliseMessage(msg: BackendMessage, userId: string): ChatMessage {
  // Guarantee sender is always a valid object — never null/undefined.
  // MessageBubble and other consumers can safely access sender.username.
  const sender = {
    _id: msg.sender?._id ?? "unknown",
    username: msg.sender?.username ?? "Unknown",
    profilePicture: msg.sender?.profilePicture,
  };

  return {
    _id: msg._id ?? `temp-${Date.now()}`,
    chatRoomId: msg.chatRoomId ?? "unknown",
    content: msg.content ?? "",
    sender,
    media: msg.media ?? [],
    createdAt: msg.createdAt
      ? new Date(msg.createdAt).toISOString()
      : new Date().toISOString(),
    isMe: sender._id === userId,
  };
}

/* ---------------------------------- */
/* Hook                               */
/* ---------------------------------- */

export function useChatEngine(chatRoomId: string, userId: string) {
  const { socket, isConnected } = useSocket();
  const userIdRef = useRef(userId);

  const {
    data: messages,
    setData: setMessages,
    loading,
  } = useAsyncState<ChatMessage[]>();

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  /* ---------------- Load messages ---------------- */
  useEffect(() => {
    if (!chatRoomId || !userId) return;

    const hydrateMessages = async () => {
      try {
        const msgRes = await getChatMessages(chatRoomId);

        const backendMessages: BackendMessage[] = Array.isArray(
          msgRes?.data?.messages?.data?.messages,
        )
          ? msgRes.data.messages.data.messages
          : [];

        const hydrated = backendMessages
          .map((msg) => {
            try {
              return normaliseMessage(msg, userId);
            } catch (err) {
              console.warn("Skipping invalid message", msg, err);
              return null;
            }
          })
          .filter((m): m is ChatMessage => m !== null)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

        console.log("Hydrated messages:", hydrated);

        setMessages(hydrated);
      } catch (err) {
        console.error("Failed to hydrate messages:", err);
      }
    };

    hydrateMessages();
  }, [chatRoomId, userId, setMessages]);

  /* ---------------- Socket lifecycle ---------------- */
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const joinRoom = () => socket.emit("chat:join", { chatRoomId });
    const leaveRoom = () => socket.emit("chat:leave", { chatRoomId });

    if (isConnected) joinRoom();

    socket.on("connect", joinRoom);
    socket.on("reconnect", joinRoom);
    socket.on("disconnect", leaveRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("reconnect", joinRoom);
      socket.off("disconnect", leaveRoom);
      leaveRoom();
    };
  }, [socket, chatRoomId, isConnected]);

  /* ---------------- Incoming messages ---------------- */
  const handleIncomingMessage = useCallback(
    (msg: BackendMessage) => {
      if (msg.chatRoomId !== chatRoomId) return;

      const newMsg = normaliseMessage(msg, userIdRef.current);

      setMessages((prev) => {
        const safePrev = prev ?? [];

        if (safePrev.some((m) => m._id === newMsg._id)) return prev;

        return [...safePrev, newMsg].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    },
    [chatRoomId, setMessages],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("chat:new_message", handleIncomingMessage);
    return () => {
      socket.off("chat:new_message", handleIncomingMessage);
    };
  }, [socket, handleIncomingMessage]);

  /* ---------------- Send message ---------------- */
  const sendMessage = useCallback(
    (content: string, media: string[] = []) => {
      if (!socket || !chatRoomId) return;

      socket.emit("chat:send", { chatRoomId, content, media }, (ack: any) => {
        if (!ack?.success) console.error("Message send failed:", ack?.error);
      });

      const tempMsg: ChatMessage = {
        _id: `temp-${Date.now()}`,
        chatRoomId,
        content,
        sender: { _id: userIdRef.current, username: "Me" },
        media,
        createdAt: new Date().toISOString(),
        isMe: true,
      };

      setMessages((prev) => [...(prev ?? []), tempMsg]);
    },
    [socket, chatRoomId, setMessages],
  );

  return useMemo(
    () => ({
      messages: messages ?? [],
      loading,
      sendMessage,
      isConnected,
    }),
    [messages, loading, sendMessage, isConnected],
  );
}
