import * as ImagePicker from "expo-image-picker";
import { Paperclip, Send, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import { useSocket } from "@/api/socketRegistry";
import { useTheme } from "@/theme/ThemeProvider";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface ChatInputProps {
  chatRoomId: string;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

interface Styles {
  inputWrapper: ViewStyle;
  previewContainer: ViewStyle;
  previewImage: ImageStyle;
  removeImageBtn: ViewStyle;
  inputBar: ViewStyle;
  attachBtn: ViewStyle;
  textInput: TextStyle;
  sendBtn: ViewStyle;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function ChatInput({ chatRoomId, userId, setMessages }: ChatInputProps) {
  const { colors } = useTheme();
  const { socket, isConnected } = useSocket();

  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----------------------------- Image Picker ----------------------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  /* --------------------------- Typing Indicator -------------------------- */

  const handleTextChange = (text: string) => {
    setInput(text);

    if (!socket || !isConnected) return;

    socket.emit("chat:typing_start", { chatRoomId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:typing_stop", { chatRoomId });
    }, 2000);
  };

  /* ----------------------------- Send Message ---------------------------- */

  const handleSend = async () => {
    if (!socket || !isConnected) return;
    if (!input.trim() && !image) return;

    const messageText = input.trim();
    const currentImage = image;

    setInput("");
    setImage(null);
    setIsUploading(true);

    try {
      const mediaIds = currentImage ? [currentImage] : [];
      const payload = { chatRoomId, content: messageText || "", mediaIds };

      socket.emit("chat:send", payload, (ack: any) => {
        if (!ack?.success) console.error("Message send failed:", ack?.error);
      });

      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        chatRoomId,
        content: messageText || "Sent an image",
        sender: { _id: userId, username: "Me" },
        createdAt: new Date().toISOString(),
        isMe: true,
        media: mediaIds,
      };

      setMessages((prev) => [optimisticMessage, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------------------------------- JSX --------------------------------- */

  return (
    <View style={[styles.inputWrapper, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
            <X size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.inputBar, { backgroundColor: colors.surfaceLight }]}>
        <TouchableOpacity style={styles.attachBtn} onPress={pickImage} disabled={isUploading}>
          <Paperclip size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={[styles.textInput, { color: colors.textPrimary }]}
          placeholder="Message..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={handleTextChange}
          multiline
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={(!input.trim() && !image) || isUploading}
          style={[styles.sendBtn, { backgroundColor: input.trim() || image ? colors.accent : colors.textSecondary }]}
        >
          {isUploading ? <ActivityIndicator size="small" color="#fff" /> : <Send size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* --------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create<Styles>({
  inputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    borderTopWidth: 1,
  },
  previewContainer: {
    marginBottom: 10,
    position: "relative",
    width: 100,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  attachBtn: { padding: 10 },
  textInput: { flex: 1, fontSize: 16, paddingHorizontal: 10, paddingVertical: 10, maxHeight: 120 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 4, marginRight: 4 },
});
