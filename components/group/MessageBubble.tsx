import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { ChatMessage } from "@/hooks/useChatEngine";
import { useTheme } from "@/theme/ThemeProvider";

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

// Figma design:
// • Own messages  → purple (#7C5CFC) bubble, right-aligned, timestamp below outside
// • Their messages → dark surface bubble, left-aligned, avatar + sender name above, timestamp below outside

function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const { colors } = useTheme();

  const bubbleBg = isMe ? colors.messageSent : colors.surfaceLight;
  const textColor = isMe ? "#FFFFFF" : colors.textPrimary;
  const timestampColor = colors.textSecondary;

  const timeStr = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isMe) {
    return (
      <View style={[styles.wrapper, styles.myWrapper]}>
        <View style={[styles.bubble, styles.myBubble, { backgroundColor: bubbleBg }]}>
          {message.content.length > 0 && (
            <Text style={[styles.messageText, { color: textColor }]}>
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
        </View>
        <Text style={[styles.timestamp, styles.myTimestamp, { color: timestampColor }]}>
          {timeStr}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, styles.theirWrapper]}>
      {/* Avatar */}
      <View style={styles.avatarCol}>
        <Avatar uri={message.sender?.profilePicture} size={32} />
      </View>

      <View style={styles.theirContent}>
        {/* Sender name */}
        <Text style={[styles.senderName, { color: colors.textSecondary }]}>
          {message.sender?.username ?? "Unknown"}
        </Text>

        <View style={[styles.bubble, styles.theirBubble, { backgroundColor: bubbleBg }]}>
          {message.content.length > 0 && (
            <Text style={[styles.messageText, { color: textColor }]}>
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
        </View>

        <Text style={[styles.timestamp, styles.theirTimestamp, { color: timestampColor }]}>
          {timeStr}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(MessageBubble, (prev, next) => {
  return (
    prev.message._id === next.message._id &&
    prev.message.content === next.message.content &&
    prev.message.media.length === next.message.media.length &&
    prev.isMe === next.isMe
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  myWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  theirWrapper: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarCol: {
    marginRight: 8,
    marginTop: 18, // aligns avatar with sender name + bubble
  },
  theirContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: "100%",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myTimestamp: {
    alignSelf: "flex-end",
  },
  theirTimestamp: {
    alignSelf: "flex-start",
  },
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
  },
});