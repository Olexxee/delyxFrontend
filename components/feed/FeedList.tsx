import { FeedItem, mockFeed } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { FeedCardHeader } from "./FeedCardHeader";
import { FixtureCard } from "./FixtureCard";
import { LiveMatchCard } from "./LiveMatchCard";
import { ResultCard } from "./ResultCard";

// Group feed items by groupName
function groupByGroupName(feed: FeedItem[]) {
  const groups: Record<string, FeedItem[]> = {};
  feed.forEach((item) => {
    if (!groups[item.groupName]) groups[item.groupName] = [];
    groups[item.groupName].push(item);
  });

  return Object.entries(groups).map(([groupName, matches]) => ({
    groupName,
    tournamentName: matches[0]?.tournamentName,
    matches,
  }));
}

export function FeedList() {
  const { colors } = useTheme(); // colors comes from your Colors object
  const groupedFeed = groupByGroupName(mockFeed);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {groupedFeed.map((group) => (
        <View
          key={group.groupName}
          style={[
            styles.groupSection,
            { backgroundColor: colors.surfaceLight },
          ]}
        >
          {/* Group Header */}
          <FeedCardHeader
            groupName={group.groupName}
            tournamentName={group.tournamentName}
          />

          {/* Horizontal scrollable matches */}
          <FlatList
            horizontal
            data={group.matches}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => {
              let CardComponent;

              switch (item.type) {
                case "FIXTURE":
                  CardComponent = FixtureCard;
                  break;
                case "RESULT":
                  CardComponent = ResultCard;
                  break;
                case "LIVE":
                  CardComponent = LiveMatchCard;
                  break;
                default:
                  return null;
              }

              return (
                <View style={styles.horizontalCardSpacer}>
                  <CardComponent item={item} />
                </View>
              );
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  groupSection: {
    marginBottom: 24,
    paddingVertical: 6,
    borderRadius: 12,
  },
  horizontalList: {
    paddingHorizontal: 12,
  },
  horizontalCardSpacer: {
    marginRight: 12,
  },
});
