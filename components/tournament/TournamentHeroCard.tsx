import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentProgress from "./TournamentProgress";
import TournamentStatusBadge from "./TournamentStatusBadge";

interface Props {
  tournament: TournamentDetail;
  showProgress?: boolean;
  showWinnerBanner?: boolean;
  showViewerRegistrationState?: boolean;
}

export default function TournamentHero({
  tournament,
  showProgress = true,
  showWinnerBanner = false,
  showViewerRegistrationState = false,
}: Props) {
  const { colors } = useTheme();

  const winner = tournament.outcome?.winner;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {tournament.name}
          </Text>
          <Text style={[styles.groupText, { color: colors.textSecondary }]}>
            Code: {tournament.tournamentCode}
          </Text>
        </View>

        <TournamentStatusBadge status={tournament.status} />
      </View>

      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {tournament.type.replace("_", " ")}
        </Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {tournament.participantCount}/{tournament.maxParticipants}{" "}
          participants
        </Text>
      </View>

      {showViewerRegistrationState && tournament.viewerContext.isRegistered ? (
        <View
          style={[
            styles.viewerBadge,
            {
              backgroundColor: `${colors.accent}14`,
              borderColor: colors.accent,
            },
          ]}
        >
          <Text style={[styles.viewerBadgeText, { color: colors.accent }]}>
            You are participating
          </Text>
        </View>
      ) : null}

      {showWinnerBanner && winner ? (
        <View
          style={[
            styles.winnerCard,
            {
              backgroundColor: `${colors.gold}14`,
              borderColor: colors.gold,
            },
          ]}
        >
          <Text style={[styles.winnerLabel, { color: colors.textSecondary }]}>
            Winner
          </Text>
          <Text style={[styles.winnerName, { color: colors.textPrimary }]}>
            {winner.username}
          </Text>
        </View>
      ) : null}

      {showProgress ? (
        <TournamentProgress progress={tournament.progress} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
  },
  groupText: {
    fontSize: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  viewerBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  viewerBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  winnerCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  winnerLabel: {
    fontSize: 12,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: "800",
  },
});
