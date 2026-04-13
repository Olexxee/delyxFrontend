import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { ChatMessageVM } from "@/view-models/message.vm";

type Props = {
  message: Extract<ChatMessageVM, { kind: "user" }>;
};

export function UserMessageBubble({ message }: Props) {
  const { colors } = useTheme();

  const isMine = message.isMine;

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isMine ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMine ? colors.messageSent : colors.surfaceLight,
          },
        ]}
      >
        {message.content ? (
          <Text style={{ color: "#fff" }}>{message.content}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    marginVertical: 4,
  },
  bubble: {
    padding: 10,
    borderRadius: 14,
  },
});
