import { ChatMessage } from "@/hooks/useChatEngine";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  userId?: string;
}

type ListItem =
  | { type: "message"; data: ChatMessage }
  | { type: "dateSeparator"; label: string; key: string };

function formatDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function buildListItems(messages: ChatMessage[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDateStr = "";

  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    const dateStr = date.toDateString();

    if (dateStr !== lastDateStr) {
      items.push({
        type: "dateSeparator",
        label: formatDateLabel(date),
        key: `sep-${dateStr}`,
      });
      lastDateStr = dateStr;
    }

    items.push({ type: "message", data: msg });
  }

  return items;
}

export default function MessageList({ messages, loading }: MessageListProps) {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList<ListItem>>(null);

  const listItems = buildListItems(messages);

  useEffect(() => {
    if (listItems.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, [messages]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "dateSeparator") {
        return (
          <View style={styles.separatorRow}>
            <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.separatorText, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
            <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
          </View>
        );
      }
      return <MessageBubble message={item.data} isMe={item.data.isMe} />;
    },
    [colors],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    return item.type === "dateSeparator" ? item.key : item.data._id;
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList<ListItem>
      ref={flatListRef}
      data={listItems}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews
      initialNumToRender={20}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No messages yet. Say hi! 👋
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 14 },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 12,
  },
});