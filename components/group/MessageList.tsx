import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native";
import MessageBubble from "./MessageBubble";
import { decryptMessage } from "@/utils/crypto";

export interface Message {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: { _id: string; username: string; profilePicture?: string };
  media?: any[];
  createdAt: string;
  isMe?: boolean;
}

interface MessageListProps {
  messages: Message[];
  aesKey: string;
  socket: any;
  chatRoomId: string;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function MessageList({
  messages,
  aesKey,
  socket,
  chatRoomId,
  userId,
  setMessages,
}: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    socket.emit("chat:join", { chatRoomId });

    const handleNewMessage = (msg: any) => {
      const decryptedContent = msg.encryptedContent ? decryptMessage(msg, aesKey) : msg.content;
      const formattedMsg: Message = {
        _id: msg._id ?? Date.now().toString(),
        chatRoomId: msg.chatRoomId,
        content: decryptedContent,
        sender: msg.sender ?? { _id: "unknown", username: "Unknown" },
        media: msg.media ?? [],
        createdAt: msg.createdAt ?? new Date().toISOString(),
        isMe: msg.sender?._id === userId,
      };
      setMessages(prev => [formattedMsg, ...prev]);
    };

    socket.on("chat:new_message", handleNewMessage);

    return () => {
      socket.off("chat:new_message", handleNewMessage);
      socket.emit("chat:leave", { chatRoomId });
    };
  }, [socket, chatRoomId, userId, aesKey]);

  return (
    <FlatList
      ref={flatListRef}
      inverted
      data={messages}
      renderItem={({ item }) => <MessageBubble message={item} aesKey={aesKey} isMe={item.isMe!} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
    />
  );
}
