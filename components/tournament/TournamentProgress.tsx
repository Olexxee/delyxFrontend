import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  currentMatchday?: number;
  totalMatchdays?: number;
}

export default function TournamentProgress({
  currentMatchday,
  totalMatchdays,
}: Props) {
  const { colors } = useTheme();

  if (
    typeof currentMatchday !== "number" ||
    typeof totalMatchdays !== "number" ||
    totalMatchdays <= 0
  ) {
    return null;
  }

  const percent = Math.min(
    Math.round((currentMatchday / totalMatchdays) * 100),
    100,
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.matchdayText, { color: colors.textSecondary }]}>
        Matchday {currentMatchday} of {totalMatchdays}
      </Text>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: colors.accent,
              width: `${percent}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    gap: 6,
  },
  matchdayText: {
    fontSize: 13,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});