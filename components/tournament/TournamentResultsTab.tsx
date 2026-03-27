import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentFixturesTab from "./TournamentFixturesTab";

interface Props {
  tournament: TournamentDetail;
}

export default function TournamentResultsTab({ tournament }: Props) {
  const { colors } = useTheme();
  const winner = tournament.outcome?.winner;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Tournament Result
        </Text>

        <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
          Winner
        </Text>
        <Text style={[styles.resultValue, { color: colors.textPrimary }]}>
          {winner?.username || "Winner not available"}
        </Text>
      </View>

      <TournamentFixturesTab
        fixtures={tournament.fixtures ?? []}
        viewerParticipantId={tournament.viewerContext.participantId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "800",
  },
});
