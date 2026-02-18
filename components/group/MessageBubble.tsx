import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  sender: { _id: string; username: string };
  media?: string[];
  isMe: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, isMe ? styles.myMsg : styles.theirMsg]}>
      {!isMe && <Text style={[styles.senderName, { color: colors.accent }]}>{message.sender.username}</Text>}

      <View style={[styles.bubble, { backgroundColor: isMe ? colors.accent : colors.surfaceLight }]}>
        <Text style={[styles.messageText, { color: isMe ? "#fff" : colors.textPrimary }]}>{message.content}</Text>

        {message.media?.length ? (
          <View style={styles.mediaContainer}>
            {message.media.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.media} />
            ))}
          </View>
        ) : null}

        <Text style={[styles.timestamp, { color: isMe ? "rgba(255,255,255,0.7)" : colors.textSecondary }]}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12, maxWidth: "85%" },
  myMsg: { alignSelf: "flex-end" },
  theirMsg: { alignSelf: "flex-start" },
  senderName: { fontSize: 12, fontWeight: "700", marginBottom: 4, marginLeft: 4 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  messageText: { fontSize: 15, lineHeight: 20 },
  timestamp: { fontSize: 9, alignSelf: "flex-end", marginTop: 4 },
  mediaContainer: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  media: { width: 100, height: 100, borderRadius: 10, marginBottom: 8, marginRight: 8 },
});
