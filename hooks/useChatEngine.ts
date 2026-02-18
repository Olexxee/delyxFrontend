import { getChatMessages, getGroupAESKey } from "@/api/apiService";
import { useSocket } from "@/api/socketRegistry";
import { decryptMessage, EncryptedMessagePayload } from "@/utils/crypto";
import { useAsyncState } from "@/utils/useAsyncState";
import { useCallback, useEffect, useMemo } from "react";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export interface BackendMessage {
  _id: string;
  chatRoom: string;
  sender?: { _id: string; username?: string; profilePicture?: string };
  encryptedContent?: string;
  content?: string;
  media?: any[];
  createdAt?: string;
}

export interface ChatMessage {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: { _id: string; username: string; profilePicture?: string };
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
     1️⃣ Hydrate messages (fetch + decrypt)
  ========================================================== */
  useEffect(() => {
    if (!chatRoomId) return;

    const hydrateMessages = async (): Promise<ChatMessage[]> => {
      try {
        // Fetch key + messages
        const [keyRes, msgRes] = await Promise.all([
          getGroupAESKey(chatRoomId),
          getChatMessages(chatRoomId),
        ]);

        // Correctly extract AES key from nested data
        const key = keyRes?.data?.aesKey ?? null;
        console.log("Group AES key:", key);

        console.log("Raw API messages:", msgRes);

        // Ensure messages array exists
        const backendMessages: BackendMessage[] =
          msgRes?.data?.messages?.data?.messages ?? [];

        // Map backend -> hydrated frontend messages
        const hydrated: ChatMessage[] = backendMessages.map((msg) => {
          const payload = {
            encryptedContent: msg.encryptedContent,
            content: msg.content,
          };

          // If we have an AES key, decrypt, otherwise fallback to plaintext content
          const content = key ? decryptMessage(payload) : msg.content || "";

          return {
            _id: msg._id,
            chatRoomId: msg.chatRoom,
            content,
            sender: {
              _id: msg.sender?._id || "unknown",
              username: msg.sender?.username || "Unknown",
              profilePicture: msg.sender?.profilePicture,
            },
            media: msg.media || [],
            createdAt: msg.createdAt || new Date().toISOString(),
            isMe: msg.sender?._id === userId,
          };
        });

        // Sort ascending by createdAt
        hydrated.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        console.log("Hydrated messages:", hydrated);
        return hydrated;
      } catch (err) {
        console.error("Failed to hydrate messages:", err);
        return [];
      }
    };

    run(hydrateMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId, userId, run]);

  /* =========================================================
     2️⃣ Handle socket join/leave lifecycle
  ========================================================== */
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

  /* =========================================================
     3️⃣ Handle incoming messages
  ========================================================== */
  const handleIncomingMessage = useCallback(
    (msg: BackendMessage) => {
      if (msg.chatRoom !== chatRoomId) return;

      const payload: EncryptedMessagePayload = {
        encryptedContent: msg.encryptedContent,
        content: msg.content,
      };

      const content = msg.encryptedContent
        ? decryptMessage(payload)
        : msg.content || "";

      const newMsg: ChatMessage = {
        _id: msg._id,
        chatRoomId: msg.chatRoom,
        content,
        sender: {
          _id: msg.sender?._id || "unknown",
          username: msg.sender?.username || "Unknown",
          profilePicture: msg.sender?.profilePicture,
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
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        return merged;
      });
    },
    [chatRoomId, userId, setMessages],
  );

  useEffect(() => {
    if (!socket) return;

    const listener = (msg: BackendMessage) => handleIncomingMessage(msg);

    socket.on("chat:new_message", listener);

    return () => {
      socket.off("chat:new_message", listener);
    };
  }, [socket, handleIncomingMessage]);

  /* =========================================================
     4️⃣ Send message
  ========================================================== */
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

  /* =========================================================
     5️⃣ Return API
  ========================================================== */
  return useMemo(
    () => ({
      messages: messages ?? [],
      setMessages,
      loading,
      sendMessage,
      isConnected,
    }),
    [messages, setMessages, loading, sendMessage, isConnected],
  );
}
