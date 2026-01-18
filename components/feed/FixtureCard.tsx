import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FeedItem } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { resolveAvatarShapes } from "@/utils/resolveAvatarShape";
import { FeedCard } from "./FeedCard";
import { FeedCardHeader } from "./FeedCardHeader";

type FixtureCardProps = {
  item: FeedItem;
};

export function FixtureCard({ item }: FixtureCardProps) {
  const { colors } = useTheme();
  const shapes = resolveAvatarShapes(item);

  return (
    <FeedCard>
      {/* Header */}
      <FeedCardHeader
        groupName={item.groupName}
        tournamentName={item.tournamentName}
      />

      {/* Match */}
      <View style={styles.matchRow}>
        <View style={styles.avatarColumn}>
          <Avatar
            uri={item.yourAvatar}
            shape={shapes.your}
            borderColor={colors.accent}
          />
          <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>
            {item.yourName}
          </Text>
        </View>

        <Text style={[styles.vs, { color: colors.textSecondary }]}>VS</Text>

        <View style={styles.avatarColumn}>
          <Avatar
            uri={item.opponentAvatar}
            shape={shapes.opponent}
            borderColor={colors.accent}
          />
          <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>
            {item.opponentName}
          </Text>
        </View>
      </View>

      {/* Status */}
      <View style={styles.badgeRow}>
        {item.status === "UPCOMING" && <Badge label="UPCOMING" type="status" />}
        {item.status === "ACTION_REQUIRED" && <Badge label="!" type="status" />}
        {item.status === "LIVE" && (
          <Badge label="LIVE" type="status" color={colors.danger} />
        )}
      </View>

      {/* Time */}
      <Text style={[styles.time, { color: colors.warning }]}>
        {item.scheduledAt
          ? new Date(item.scheduledAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "TBD"}
      </Text>
    </FeedCard>
  );
}

const styles = StyleSheet.create({
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 8,
  },
  avatarColumn: {
    alignItems: "center",
  },
  playerLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  vs: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
