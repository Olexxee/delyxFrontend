import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl, View, Text } from "react-native";
import { FeedItem, mockFeed } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { FixturesGroup } from "./FixtureGroup";

/**
 * Groups feed items by their groupName.
 * Provides a fallback to "General" if groupName is missing.
 */
function groupAllByGroupName(feed: FeedItem[]): Record<string, FeedItem[]> {
  if (!feed || !Array.isArray(feed)) return {};

  return feed.reduce((groups: Record<string, FeedItem[]>, item) => {
    const group = item.groupName || "General";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
}

export function FeedList() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Memoize grouped data to prevent unnecessary recalculations
  const { groupedFeed, isEmpty } = useMemo(() => {
    const data = mockFeed || [];
    const grouped = groupAllByGroupName(data);
    return {
      groupedFeed: grouped,
      isEmpty: data.length === 0,
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data fetch
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, isEmpty && styles.emptyContent]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
    >
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🏟️</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No activity yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Check back later for matches and results.
          </Text>
        </View>
      ) : (
        Object.entries(groupedFeed).map(([groupName, items]) => {
          // Defensive check to ensure items is always an array
          const safeItems = Array.isArray(items) ? items : [];

          return (
            <FixturesGroup
              key={groupName}
              groupName={groupName}
              tournamentName={items[0]?.tournamentName}
              items={items || []} // Double safety
            />
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingBottom: 60
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});