import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { UnreadBadge } from "@/components/ui/UnreadBadge";
import { PreviewRowShell } from "./PreviewRowShell";
import { useTheme } from "@/theme/ThemeProvider";
import type { ConversationListItemVM } from "@/view-models/conversation.vm";

type ConversationPreviewCardProps = {
  item: ConversationListItemVM;
  onPress: (item: ConversationListItemVM) => void;
};

function formatTime(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ConversationPreviewCard({
  item,
  onPress,
}: ConversationPreviewCardProps) {
  const { colors } = useTheme();

  return (
    <PreviewRowShell
      onPress={() => onPress(item)}
      leading={
        <Avatar uri={item.avatarUrl} label={item.fallbackLabel} size={52} />
      }
      center={
        <View>
          <View style={styles.topRow}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: colors.textPrimary }]}
            >
              {item.title}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {item.subtitle ?? "No messages yet"}
          </Text>
        </View>
      }
      trailing={
        <View style={styles.trailingContent}>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(item.timestamp)}
          </Text>
          <View style={styles.badgeWrap}>
            <UnreadBadge count={item.unreadCount} />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  trailingContent: {
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 11,
  },
  badgeWrap: {
    minHeight: 22,
    justifyContent: "flex-end",
  },
});
