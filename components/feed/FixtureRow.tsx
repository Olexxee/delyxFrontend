import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FeedItem } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { resolveAvatarShapes } from "@/utils/resolveAvatarShape";

export function FixtureRow({ item }: { item: FeedItem }) {
  const { colors } = useTheme();
  const shapes = resolveAvatarShapes(item); // Individual shape logic

  return (
    <View style={styles.rowContainer}>
      <View style={styles.matchRow}>
        {/* Your Player */}
        <View style={styles.avatarColumn}>
          <Avatar uri={item.yourAvatar} shape={shapes.your} borderColor={colors.accent} />
          <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>{item.yourName}</Text>
        </View>

        <View style={styles.centerColumn}>
          <Text style={[styles.vs, { color: colors.textSecondary }]}>VS</Text>
          <Text style={[styles.time, { color: colors.warning }]}>
            {item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD"}
          </Text>
        </View>

        {/* Opponent Player */}
        <View style={styles.avatarColumn}>
          <Avatar uri={item.opponentAvatar} shape={shapes.opponent} borderColor={colors.accent} />
          <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>{item.opponentName}</Text>
        </View>
      </View>

      {/* Action Badges */}
      <View style={styles.badgeRow}>
        {item.status === "LIVE" && <Badge label="LIVE" type="status" color={colors.danger} />}
        {item.status === "ACTION_REQUIRED" && <Badge label="!" type="status" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: { paddingVertical: 8 },
  matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarColumn: { alignItems: "center", flex: 1 },
  centerColumn: { alignItems: "center", flex: 1 },
  playerLabel: { marginTop: 4, fontSize: 11, fontWeight: "600", textAlign: "center" },
  vs: { fontSize: 12, fontWeight: "700" },
  time: { fontSize: 10, fontWeight: "600", marginTop: 2 },
  badgeRow: { flexDirection: "row", justifyContent: "center", marginTop: 4 },
});