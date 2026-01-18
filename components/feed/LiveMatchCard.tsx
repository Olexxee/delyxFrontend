import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FeedItem } from "@/constants/mockFeed";
import { Shapes } from "@/theme/shapes";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FeedCard } from "./FeedCard";

type LiveMatchCardProps = { item: FeedItem };

export function LiveMatchCard({ item }: LiveMatchCardProps) {
  const { colors } = useTheme();

  return (
    <FeedCard>
      <Text style={[styles.live, { color: colors.danger }]}>● LIVE</Text>

      <View style={styles.matchRow}>
        <Avatar
          uri={item.yourAvatar}
          shape={Shapes.triangle}
          borderColor={colors.accent}
        />
        <Text style={[styles.vs, { color: colors.textSecondary }]}>VS</Text>
        <Avatar uri={item.opponentAvatar} shape={Shapes.circle} />
      </View>

      <View style={styles.badgeRow}>
        <Badge label="LIVE" type="status" color={colors.danger} />
      </View>

      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        {item.groupName} • {item.tournamentName}
      </Text>
    </FeedCard>
  );
}

const styles = StyleSheet.create({
  live: { fontSize: 11, fontWeight: "800", marginBottom: 6 },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  vs: { fontSize: 12, fontWeight: "700" },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
    paddingHorizontal: 24,
  },
  meta: { fontSize: 12 },
});
