import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { ChatMessage } from "@/hooks/useChatEngine";
import { useTheme } from "@/theme/ThemeProvider";

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, isMe ? styles.myMsg : styles.theirMsg]}>
      {!isMe && (
        <Text style={[styles.senderName, { color: colors.accent }]}>
          {message.sender?.username ?? "Unknown"}
        </Text>
      )}


      <View
        style={[
          styles.bubble,
          { backgroundColor: isMe ? colors.accent : colors.surfaceLight },
        ]}
      >
        {message.content.length > 0 && (
          <Text
            style={[
              styles.messageText,
              { color: isMe ? "#fff" : colors.textPrimary },
            ]}
          >
            {message.content}
          </Text>
        )}

        {message.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {message.media.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.media} />
            ))}
          </View>
        )}

        <Text
          style={[
            styles.timestamp,
            {
              color: isMe
                ? "rgba(255,255,255,0.7)"
                : colors.textSecondary,
            },
          ]}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* React.memo — skip re-render when message data hasn't changed.       */
/* We compare by _id + content + media length; that covers the temp → */
/* real replacement as well as any unlikely content edits.             */
/* ------------------------------------------------------------------ */
export default React.memo(MessageBubble, (prev, next) => {
  return (
    prev.message._id === next.message._id &&
    prev.message.content === next.message.content &&
    prev.message.media.length === next.message.media.length &&
    prev.isMe === next.isMe
  );
});

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12, maxWidth: "85%" },
  myMsg: { alignSelf: "flex-end" },
  theirMsg: { alignSelf: "flex-start" },
  senderName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  messageText: { fontSize: 15, lineHeight: 20 },
  timestamp: { fontSize: 9, alignSelf: "flex-end", marginTop: 4 },
  mediaContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    marginRight: 8,
  },
});