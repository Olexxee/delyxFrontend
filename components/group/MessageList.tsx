import React, { useRef } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import MessageBubble from "./MessageBubble";

/* ---------------------------------- */
/* Types                               */
/* ---------------------------------- */

// Clean, decrypted message type used by UI
export interface Message {
  _id: string;
  chatRoomId: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  media?: any[];
  createdAt: string;
  isMe: boolean;
}

interface MessageListProps {
  messages: Message[];
}

/* ---------------------------------- */
/* Component                           */
/* ---------------------------------- */

export default function MessageList({ messages }: MessageListProps) {
  const flatListRef = useRef<FlatList<Message>>(null);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      inverted
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <MessageBubble
          message={item}
          isMe={item.isMe}
        />
      )}
      contentContainerStyle={styles.listContainer}
      removeClippedSubviews
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={10}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No messages yet. Say hi!
          </Text>
        </View>
      }
    />
  );
}

/* ---------------------------------- */
/* Styles                              */
/* ---------------------------------- */

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scaleY: -1 }], // Flip back since list is inverted
    marginTop: 50,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
});
