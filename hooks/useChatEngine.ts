import { getChatMessages, getGroupAESKey } from "@/api/apiService";
import { useSocket } from "@/api/socketRegistry";
import { decryptMessage, EncryptedMessagePayload } from "@/utils/crypto";
import { useCallback, useEffect, useState } from "react";

/* ---------------------------------- */
/* Backend and UI message types        */
/* ---------------------------------- */

export interface BackendMessage {
  _id: string;
  chatRoomId: string;
  sender?: { _id: string; username?: string };
  encryptedContent?: string;
  iv?: string;
  authTag?: string;
  content?: string;
  media?: any[];
  createdAt?: string;
}

export interface ChatMessage {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: {
    _id: string;
    username: string;
  };
  media?: any[];
  createdAt: string;
  isMe: boolean;
}

/* ---------------------------------- */
/* Hook                                */
/* ---------------------------------- */

export function useChatEngine(chatRoomId: string, userId: string) {
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* -----------------------------
     1️⃣ Initialize chat (key + history)
  ----------------------------- */
  useEffect(() => {
    let cancelled = false;

    const initChat = async () => {
      try {
        setLoading(true);

        const [keyRes, msgRes] = await Promise.all([
          getGroupAESKey(chatRoomId),
          getChatMessages(chatRoomId),
        ]);

        if (cancelled) return;

        const key = keyRes?.data?.aesKey ?? null;

        if (msgRes?.success && Array.isArray(msgRes.data)) {
          const hydrated: ChatMessage[] = msgRes.data.map(
            (msg: BackendMessage) => {
              const payload: EncryptedMessagePayload = {
                encryptedContent: msg.encryptedContent,
                content: msg.content,
              };

              const content = key ? decryptMessage(payload) : msg.content || "";

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
            },
          );

          setMessages(hydrated);
        } else {
          setMessages([]);
        }
      } catch (err) {
        if (!cancelled) console.error("Chat initialization failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (chatRoomId) initChat();

    return () => {
      cancelled = true;
    };
  }, [chatRoomId, userId]);

  /* -----------------------------
     2️⃣ Socket room lifecycle
  ----------------------------- */
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

  /* -----------------------------
     3️⃣ Listen for incoming messages
  ----------------------------- */
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg: BackendMessage) => {
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

      setMessages((prev) => [newMsg, ...prev]);
    };

    socket.on("chat:new_message", handleIncoming);
    return () => {
      socket.off("chat:new_message", handleIncoming);
    };
  }, [socket, chatRoomId, userId]);

  /* -----------------------------
     4️⃣ Send message (plaintext only)
  ----------------------------- */
  const sendMessage = useCallback(
    (content: string, mediaIds: string[] = []) => {
      if (!socket || !chatRoomId) return;

      socket.emit(
        "chat:send",
        { chatRoomId, content, mediaIds },
        (ack: any) => {
          if (!ack?.success) console.error("Message send failed:", ack?.error);
        },
      );
    },
    [socket, chatRoomId],
  );

  return {
    messages,
    setMessages,
    loading,
    isConnected,
    sendMessage,
  };
}
