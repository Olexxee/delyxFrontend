import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { FeedItemCard } from "./FeedItemCard";
import { mockFeed, type FeedItem } from "@/constants/mockFeed"; // Adjust path accordingly

export const ActivityFeed = () => {
  return (
    <FlatList
      data={mockFeed}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedItemCard item={item} />}
      contentContainerStyle={styles.listPadding}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listPadding: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
});
