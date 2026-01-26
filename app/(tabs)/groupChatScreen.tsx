import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Send, ChevronLeft, Shield, Info, Paperclip } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { useSocket } from "@/api/socketRegistry";
import { encryptMessage, decryptMessage } from "@/utils/crypto"; 
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/api/api"; 

interface Message {
  _id: string;
  chatRoomId: string;
  content: string; // Plain text for local display
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  media?: any[];
  createdAt: string;
  isMe?: boolean;
}

export default function GroupChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { chatRoomId, name, avatar, aesKey } = useLocalSearchParams<{ 
    chatRoomId: string; 
    name: string; 
    avatar: string; 
    aesKey: string 
  }>();
  
  // Use the hook correctly
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  // 1. Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/chat/messages/${chatRoomId}`);
        if (response.data?.success) {
          const history = response.data.data.map((msg: any) => ({
            ...msg,
            // Pass the whole msg object to decrypt iv/authTag
            content: decryptMessage(msg, aesKey),
            isMe: msg.sender._id === "MY_USER_ID" 
          }));
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    if (chatRoomId && aesKey) fetchHistory();
  }, [chatRoomId, aesKey]);

  // 2. Socket Real-time Listener
  useEffect(() => {
    if (!socket || !chatRoomId || !aesKey) return;

    // Join room event matches your backend "ChatEvents.JOIN"
    socket.emit("chat:join", { chatRoomId });

    socket.on("chat:new_message", (rawMessage: any) => {
      // rawMessage contains { encryptedContent, iv, authTag }
      const decryptedContent = decryptMessage(rawMessage, aesKey);

      const formattedMsg: Message = {
        ...rawMessage,
        content: decryptedContent,
        isMe: rawMessage.sender._id === "MY_USER_ID", 
      };

      setMessages((prev) => [formattedMsg, ...prev]);
    });

    return () => {
      socket.off("chat:new_message");
      socket.emit("chat:leave", { chatRoomId });
    };
  }, [chatRoomId, socket, aesKey]);

  // 3. Send Logic
  const handleSend = async () => {
    if (!input.trim() || !aesKey || !chatRoomId || !socket) return;

    const currentInput = input.trim();
    setInput(""); 

    // Encrypt for GCM (returns { encryptedContent, iv, authTag })
    const encrypted = encryptMessage(currentInput, aesKey);

    const payload = {
      chatRoomId,
      content: encrypted.encryptedContent,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      mediaIds: [],
    };

    // Send via Socket - matches backend chat:send
    socket.emit("chat:send", payload, (ack: any) => {
      if (!ack.success) console.error("Send failed:", ack.error);
    });

    // Optimistic Update for instant feedback
    const optimisticMsg: Message = {
      _id: Date.now().toString(),
      chatRoomId,
      content: currentInput,
      sender: { _id: "MY_USER_ID", username: "Me" },
      createdAt: new Date().toISOString(),
      isMe: true,
    };
    setMessages((prev) => [optimisticMsg, ...prev]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageWrapper, item.isMe ? styles.myMsg : styles.theirMsg]}>
      {!item.isMe && (
        <Text style={[styles.senderName, { color: colors.accent }]}>
          {item.sender.username}
        </Text>
      )}
      <View style={[styles.bubble, { backgroundColor: item.isMe ? colors.accent : colors.surfaceLight }]}>
        <Text style={[styles.messageText, { color: item.isMe ? "#fff" : colors.textPrimary }]}>
          {item.content}
        </Text>
        <Text style={[styles.timestamp, { color: item.isMe ? "rgba(255,255,255,0.7)" : colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft color={colors.textPrimary} size={28} />
        </TouchableOpacity>
        <Image source={{ uri: avatar }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.textPrimary }]} numberOfLines={1}>{name}</Text>
          <View style={styles.encryptionBadge}>
            <Shield size={10} color={colors.accent} />
            <Text style={[styles.encryptionText, { color: colors.accent }]}> End-to-end Encrypted</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerBtn}><Info color={colors.textPrimary} size={22} /></TouchableOpacity>
      </View>

      

      <FlatList
        ref={flatListRef}
        inverted
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.inputBar, { backgroundColor: colors.surfaceLight }]}>
            <TouchableOpacity style={styles.attachBtn}><Paperclip size={20} color={colors.textSecondary}/></TouchableOpacity>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, borderBottomWidth: 1 },
  headerBtn: { padding: 5 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10, backgroundColor: '#ccc' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700' },
  encryptionBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  encryptionText: { fontSize: 10, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  messageWrapper: { marginBottom: 12, maxWidth: '85%' },
  myMsg: { alignSelf: 'flex-end' },
  theirMsg: { alignSelf: 'flex-start' },
  senderName: { fontSize: 12, fontWeight: '700', marginBottom: 4, marginLeft: 4 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  messageText: { fontSize: 15, lineHeight: 20 },
  timestamp: { fontSize: 9, alignSelf: 'flex-end', marginTop: 4 },
  inputWrapper: { paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1 },
  inputBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5 },
  attachBtn: { padding: 8 },
  textInput: { flex: 1, fontSize: 16, paddingHorizontal: 10, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});