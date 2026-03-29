import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import { formatTournamentDate } from "@/utils/tournamentHelpers";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentRulesCard from "./Tournamentrulescard";

interface Props {
  tournament: TournamentDetail;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

export default function TournamentOverviewTab({ tournament }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          Overview
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {tournament.description?.trim() || "No tournament description yet."}
        </Text>

        <View style={styles.infoList}>
          <InfoRow
            label="Registration deadline"
            value={formatTournamentDate(tournament.registrationDeadline)}
          />
          <InfoRow
            label="Start date"
            value={formatTournamentDate(tournament.startDate)}
          />
          <InfoRow
            label="End date"
            value={formatTournamentDate(tournament.endDate)}
          />
          <InfoRow
            label="Tournament type"
            value={tournament.type.replace("_", " ")}
          />
        </View>
      </View>

      <TournamentRulesCard settings={tournament.settings} />
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
    gap: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
  },
  infoList: {
    gap: 10,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
