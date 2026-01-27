import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Send, Paperclip } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { encryptMessage } from "@/utils/crypto";
import { Message } from "./MessageList";

interface ChatInputProps {
  aesKey: string;
  chatRoomId: string;
  socket: any;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatInput({ aesKey, chatRoomId, socket, userId, setMessages }: ChatInputProps) {
  const { colors } = useTheme();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !aesKey || !chatRoomId || !socket) return;

    const currentInput = input.trim();
    setInput("");

    const encrypted = encryptMessage(currentInput, aesKey);

    const payload = {
      chatRoomId,
      content: encrypted.encryptedContent,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      mediaIds: [],
    };

    socket.emit("chat:send", payload, (ack: any) => {
      if (!ack.success) console.error("Send failed:", ack.error);
    });

    const optimisticMessage: Message = {
      _id: Date.now().toString(),
      chatRoomId,
      content: currentInput,
      sender: { _id: userId, username: "Me" },
      createdAt: new Date().toISOString(),
      isMe: true,
      media: [],
    };

    setMessages(prev => [optimisticMessage, ...prev]);
  };

  return (
    <View style={[styles.inputWrapper, { borderTopColor: colors.border }]}>
      <View style={[styles.inputBar, { backgroundColor: colors.surfaceLight }]}>
        <TouchableOpacity style={styles.attachBtn}>
          <Paperclip size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { color: colors.textPrimary }]}
          placeholder="Message..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, { backgroundColor: colors.accent }]}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1 },
  inputBar: { flexDirection: "row", alignItems: "center", borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5 },
  attachBtn: { padding: 8 },
  textInput: { flex: 1, fontSize: 16, paddingHorizontal: 10, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
});
