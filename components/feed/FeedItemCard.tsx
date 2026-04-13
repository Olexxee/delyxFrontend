import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { FeedItem } from "@/constants/mockFeed";

export const FeedItemCard = ({ item }: { item: FeedItem }) => {
  const isLive = item.type === "LIVE";
  const isResult = item.type === "RESULT";

  return (
    <View style={[styles.card, isLive && styles.liveBorder]}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.groupText}>
          {item.groupName} • {item.tournamentName}
        </Text>
        {isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Match Details */}
      <View style={styles.matchContainer}>
        <View style={styles.competitor}>
          <Image source={{ uri: item.yourAvatar }} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {item.yourName}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          {isResult ? (
            <Text style={styles.scoreText}>{item.score}</Text>
          ) : (
            <Text style={styles.vsText}>VS</Text>
          )}
          {item.status === "UPCOMING" && (
            <Text style={styles.timeText}>
              {new Date(item.scheduledAt!).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        <View style={styles.competitor}>
          <Image source={{ uri: item.opponentAvatar }} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {item.opponentName}
          </Text>
        </View>
      </View>

      {/* Outcome Footer for Results */}
      {isResult && item.outcome && (
        <View style={styles.footer}>
          <Text style={[styles.outcomeText, styles[item.outcome]]}>
            {item.outcome}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  liveBorder: {
    borderColor: "#FF3B30",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  groupText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  liveBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  liveText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  competitor: {
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    backgroundColor: "#333",
  },
  name: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: "center",
    flex: 1,
  },
  scoreText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  vsText: {
    color: "#555",
    fontSize: 18,
    fontWeight: "900",
  },
  timeText: {
    color: "#AAA",
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  outcomeText: {
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  WIN: { color: "#4CD964" },
  LOSS: { color: "#FF3B30" },
  DRAW: { color: "#FFCC00" },
});
