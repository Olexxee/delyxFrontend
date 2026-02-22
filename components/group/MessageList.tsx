import { ChatMessage } from "@/hooks/useChatEngine";
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

export default function MessageList({ messages, loading }: MessageListProps) {
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  // Scroll to the last item (newest message) whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, [messages]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble message={item} isMe={item.isMe} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item._id, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList<ChatMessage>
      ref={flatListRef}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      keyboardShouldPersistTaps="handled"
      // Virtualisation — only render what's on screen
      removeClippedSubviews
      initialNumToRender={20}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      // Scroll anchors to newest message on mount
      initialScrollIndex={messages.length > 0 ? messages.length - 1 : undefined}
      // Required when using initialScrollIndex
      getItemLayout={(_data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#888", fontSize: 14 },
});