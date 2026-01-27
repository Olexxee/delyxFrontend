import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSocket } from "@/api/socketRegistry";
import ChatHeader from "@/components/group/ChatHeader";
import MessageList from "@/components/group/MessageList";
import ChatInput from "@/components/group/ChatInput";
import { decryptMessage } from "@/utils/crypto";
import { getChatMessages } from "@/api/apiService";
import { UserContext } from "@/authContext/UserContext";

// Custom hook for accessing user context
export function useUser() {
  return useContext(UserContext);
}

export default function GroupChatScreen() {
  const { chatRoomId, name, avatar, aesKey } = useLocalSearchParams();
  const { user } = useUser();
  const userId = user?._id;

  const router = useRouter();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);

  // Fetch chat history and decrypt
  useEffect(() => {
    if (!chatRoomId || !aesKey || !userId) return;

    const fetchHistory = async () => {
      try {
        const res = await getChatMessages(chatRoomId);
        if (res?.success && Array.isArray(res.data)) {
          const decrypted = res.data.map((msg) => ({
            ...msg,
            content: decryptMessage(msg, aesKey),
            isMe: msg.sender._id === userId,
          }));
          setMessages(decrypted);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchHistory();
  }, [chatRoomId, aesKey, userId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatHeader name={name} avatar={avatar} onBack={() => router.back()} />

      <MessageList
        messages={messages}
        aesKey={aesKey}
        socket={socket}
        chatRoomId={chatRoomId}
        userId={userId}
        setMessages={setMessages}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ChatInput
          aesKey={aesKey}
          chatRoomId={chatRoomId}
          socket={socket}
          userId={userId}
          setMessages={setMessages}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
