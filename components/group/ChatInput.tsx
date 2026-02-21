import * as ImagePicker from "expo-image-picker";
import { Paperclip, Send, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useSocket } from "@/api/socketRegistry";
import { useTheme } from "@/theme/ThemeProvider";

interface ChatInputProps {
  chatRoomId: string;
  /** Provided by useChatEngine — handles socket emit + optimistic UI in one place. */
  sendMessage: (content: string, mediaIds?: string[]) => void;
  isConnected: boolean;
}

interface Styles {
  inputWrapper: ViewStyle;
  previewScroll: ViewStyle;
  previewContainer: ViewStyle;
  previewImage: ImageStyle;
  removeImageBtn: ViewStyle;
  inputBar: ViewStyle;
  attachBtn: ViewStyle;
  textInput: TextStyle;
  sendBtn: ViewStyle;
}

export default function ChatInput({
  chatRoomId,
  sendMessage,
  isConnected,
}: ChatInputProps) {
  const { colors } = useTheme();
  const { socket } = useSocket();

  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----------------------------- Image Picker ----------------------- */
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets?.map((a) => a.uri) ?? [];
      setImages((prev) => [...prev, ...uris]);
    }
  };

  /* ---------------------------- Typing Indicator ------------------- */
  const handleTextChange = (text: string) => {
    setInput(text);

    if (!socket || !isConnected) return;

    socket.emit("chat:typing_start", { chatRoomId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:typing_stop", { chatRoomId });
    }, 2000);
  };

  /* --------------------------- Send Message ------------------------ */
  const handleSend = async () => {
    if (!isConnected) return;
    if (!input.trim() && images.length === 0) return;

    const messageText = input.trim();
    const mediaUris = [...images];

    // Clear input immediately for snappy UX
    setInput("");
    setImages([]);
    setIsUploading(true);

    try {
      sendMessage(messageText || "", mediaUris);
    } finally {
      setIsUploading(false);
    }
  };

  /* ----------------------------- JSX -------------------------------- */
  const canSend = (input.trim().length > 0 || images.length > 0) && !isUploading;

  return (
    <View
      style={[
        styles.inputWrapper,
        { borderTopColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      {images.length > 0 && (
        <ScrollView horizontal style={styles.previewScroll}>
          {images.map((uri, index) => (
            <View key={uri} style={styles.previewContainer}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputBar, { backgroundColor: colors.surfaceLight }]}>
        <TouchableOpacity
          style={styles.attachBtn}
          onPress={pickImages}
          disabled={isUploading}
        >
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
          disabled={!canSend}
          style={[
            styles.sendBtn,
            { backgroundColor: canSend ? colors.accent : colors.textSecondary },
          ]}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------------------------ Styles ---------------------------- */

const styles = StyleSheet.create<Styles>({
  inputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    borderTopWidth: 1,
  },
  previewScroll: { marginBottom: 10 },
  previewContainer: {
    marginRight: 8,
    position: "relative",
    width: 80,
    height: 80,
  },
  previewImage: {
    width: 80,
    height: 80,
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
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxHeight: 120,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    marginRight: 4,
  },
});