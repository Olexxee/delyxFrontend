import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { MatchResultFeedItem } from "@/types/feed";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: MatchResultFeedItem;
};

export function MatchResultCard({ item }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.context, { color: colors.textSecondary }]}>
          {item.tournament?.name ?? item.group?.name ?? "Recent match"}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.player}>
          <Avatar
            uri={item.homePlayer.avatarUrl}
            size={42}
            name={item.homePlayer.username}
          />
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.homePlayer.username}
          </Text>
        </View>

        <View style={styles.scoreWrap}>
          <Text style={[styles.score, { color: colors.textPrimary }]}>
            {item.homeScore} - {item.awayScore}
          </Text>
        </View>

        <View style={styles.player}>
          <Avatar
            uri={item.awayPlayer.avatarUrl}
            size={42}
            name={item.awayPlayer.username}
          />
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.awayPlayer.username}
          </Text>
        </View>
      </View>

      {!!item.statLine && (
        <Text style={[styles.statLine, { color: colors.textSecondary }]}>
          {item.statLine}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  context: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  player: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
  },
  scoreWrap: {
    minWidth: 70,
    alignItems: "center",
  },
  score: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLine: {
    fontSize: 13,
    lineHeight: 18,
  },
});
