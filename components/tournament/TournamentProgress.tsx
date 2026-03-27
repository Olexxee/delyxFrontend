import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentProgress as TournamentProgressType } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  progress: TournamentProgressType;
  asCard?: boolean;
}

export default function TournamentProgress({
  progress,
  asCard = false,
}: Props) {
  const { colors } = useTheme();

  const {
    completedMatches,
    totalMatches,
    currentMatchday,
    totalMatchdays,
  } = progress;

  const percent =
    totalMatches === 0 ? 0 : Math.round((completedMatches / totalMatches) * 100);

  const bar = (
    <>
      <Text style={[styles.matchdayText, { color: colors.textSecondary }]}>
        Matchday {currentMatchday} of {totalMatchdays}
      </Text>

      <Text style={[styles.matchesText, { color: colors.textSecondary }]}>
        {completedMatches}/{totalMatches} matches {asCard ? "played" : ""}
      </Text>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: asCard ? colors.primary : colors.accent,
              width: `${percent}%`,
            },
          ]}
        />
      </View>

      {asCard ? (
        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>
          {completedMatches} of {totalMatches} matches completed
        </Text>
      ) : null}
    </>
  );

  if (asCard) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          Progress
        </Text>
        {bar}
      </View>
    );
  }

  return <View style={styles.simple}>{bar}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  simple: {
    marginBottom: 10,
    gap: 4,
  },
  matchdayText: {
    fontSize: 13,
  },
  matchesText: {
    fontSize: 12,
  },
  subLabel: {
    fontSize: 11,
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