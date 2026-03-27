import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentSummary } from "@/types/tournament";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TournamentStatusBadge from "./TournamentStatusBadge";

interface Props {
  tournament: TournamentSummary;
  onPress: () => void;
}

export default function TournamentSummaryCard({ tournament, onPress }: Props) {
  const { colors } = useTheme();

  const progressText =
    tournament.currentMatchday != null && tournament.totalMatchdays != null
      ? `Matchday ${tournament.currentMatchday}/${tournament.totalMatchdays}`
      : `Starts ${new Date(tournament.startDate).toLocaleDateString()}`;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {tournament.name}
        </Text>
        <TournamentStatusBadge status={tournament.status} />
      </View>

      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        {tournament.type.replace("_", " ")}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {tournament.participantCount}/{tournament.maxParticipants} participants
        </Text>

        {tournament.viewerIsRegistered ? (
          <Text style={[styles.registered, { color: colors.accent }]}>
            You’re in
          </Text>
        ) : null}
      </View>

      <Text style={[styles.progress, { color: colors.textSecondary }]}>
        {progressText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
  },
  progress: {
    fontSize: 12,
  },
  registered: {
    fontSize: 12,
    fontWeight: "700",
  },
});