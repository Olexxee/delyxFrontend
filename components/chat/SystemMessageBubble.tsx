import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { ChatMessageVM } from "@/view-models/message.vm";

type Props = {
  message: Extract<ChatMessageVM, { kind: "system" }>;
  onAction?: (tournamentId: string) => void;
};

export function SystemMessageBubble({ message, onAction }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {message.content}
      </Text>

      {message.action?.type === "open_tournament" ? (
        <Pressable onPress={() => onAction?.(message.action!.tournamentId)}>
          <Text style={{ color: colors.primary, marginTop: 4 }}>
            {message.action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginVertical: 6,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
  },
});
