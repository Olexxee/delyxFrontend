import { ChatMessage } from "@/hooks/useChatEngine";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  userId?: string;
}

export default function MessageList({ messages, loading, userId }: MessageListProps) {
  // ✅ Stable renderItem reference — FlatList won't re-render all items just
  //    because the parent re-renders. MessageBubble.memo does the final guard.
  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble message={item} isMe={item.isMe} />
    ),
    // No deps: MessageBubble is memoized and reads its own theme internally.
    [],
  );

  // Stable key extractor
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
      data={messages}
      inverted
      // ✅ No scrollToOffset useEffect needed — `inverted` already anchors the
      //    list to the newest message. Adding scrollToOffset causes a double-
      //    scroll jump on every new message.
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      keyboardShouldPersistTaps="handled"
      // Performance tuning
      removeClippedSubviews
      initialNumToRender={20}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      // Only pass extraData if something outside the message object affects
      // rendering (e.g., a selected/highlighted message id). Passing `messages`
      // itself as extraData would defeat the purpose of memoization.
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // FlatList is inverted (scaleY: -1 on the list), so the empty component
    // needs to be flipped back to display text the right way up.
    transform: [{ scaleY: -1 }],
    marginTop: 50,
  },
  emptyText: { color: "#888", fontSize: 14 },
});