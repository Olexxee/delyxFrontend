import { FeedItem } from "@/constants/mockFeed";
import { FixtureCard } from "./FixtureCard";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  matches: FeedItem[];
};

export function Fixtures({ matches }: Props) {
  if (!matches.length) return null;

  // Optional: Group matches by groupName inside this component
  const groups: Record<string, FeedItem[]> = {};
  matches.forEach((match) => {
    if (!groups[match.groupName]) groups[match.groupName] = [];
    groups[match.groupName].push(match);
  });

  return (
    <View style={styles.container}>
      {Object.entries(groups).map(([groupName, groupMatches]) => (
        <View key={groupName} style={styles.groupSection}>
          <Text style={styles.groupTitle}>{groupName}</Text>
          {groupMatches.map((match) => (
            <FixtureCard key={match.id} item={match} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  groupSection: { marginBottom: 16 },
  groupTitle: { fontWeight: "700", fontSize: 14, marginBottom: 8 },
});
