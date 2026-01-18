import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FeedItem } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { resolveAvatarShapes } from "@/utils/resolveAvatarShape";
import { FeedCard } from "./FeedCard";
import { FeedCardHeader } from "./FeedCardHeader";

type ResultCardProps = {
  item: FeedItem;
  style?: ViewStyle | ViewStyle[];
};

export function ResultCard({ item, style }: ResultCardProps) {
  const { colors } = useTheme();
  const shapes = resolveAvatarShapes(item);

  const outcomeText =
    item.outcome === "WIN"
      ? "You won"
      : item.outcome === "LOSS"
        ? "You lost"
        : "Draw";

  return (
    <FeedCard style={style}>
      <FeedCardHeader
        groupName={item.groupName}
        tournamentName={item.tournamentName}
      />

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

        <Text style={[styles.score, { color: colors.textPrimary }]}>
          {item.score ?? "0 : 0"}
        </Text>

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

      <View style={styles.badgeRow}>
        {item.outcome === "WIN" && <Badge label="🏆" type="medal" />}
        {item.outcome === "LOSS" && <Badge label="❌" type="status" />}
        {item.outcome === "DRAW" && <Badge label="DRAW" type="status" />}
      </View>

      <Text style={[styles.meta, { color: colors.accent }]}>{outcomeText}</Text>
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
  score: {
    fontSize: 18,
    fontWeight: "800",
    marginHorizontal: 12,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
