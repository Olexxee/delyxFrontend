import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

type Rank = "bronze" | "silver" | "gold" | "elite";

const rankLabel: Record<Rank, string> = {
  bronze: "BRONZE",
  silver: "SILVER",
  gold: "GOLD",
  elite: "ELITE",
};

export function RankBadge({ rank }: { rank: Rank }) {
  const { colors } = useTheme();
  const rankColor = {
    bronze: colors.bronze,
    silver: colors.silver,
    gold: colors.gold,
    elite: colors.primary,
  }[rank];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Rank: ${rankLabel[rank]}`}
      style={[
        styles.badge,
        {
          backgroundColor: colors.surfaceLight,
          borderColor: rankColor,
          borderRadius: radius.sm,
        },
      ]}
    >
      <View style={[styles.marker, { backgroundColor: rankColor }]} />
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {rankLabel[rank]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  text: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
