import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStandingRow } from "@/types/tournament";
import { sortStandingsForDisplay } from "@/utils/tournamentHelpers";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  standings: TournamentStandingRow[];
  viewerParticipantId?: string | null;
}

export default function TournamentStandingsTab({
  standings,
  viewerParticipantId,
}: Props) {
  const { colors } = useTheme();

  if (!standings.length) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          No standings yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Standings will appear here once matches begin.
        </Text>
      </View>
    );
  }

  const rows = sortStandingsForDisplay(standings, viewerParticipantId);

  return (
    <View style={styles.container}>
      {rows.map((row) => {
        const isViewer = row.participantId === viewerParticipantId;
        const isTopThree = row.position <= 3;

        return (
          <View
            key={row.participantId}
            style={[
              styles.row,
              {
                backgroundColor: isViewer
                  ? `${colors.accent}14`
                  : colors.surface,
                borderColor: isViewer
                  ? colors.accent
                  : isTopThree
                    ? colors.borderLight
                    : colors.border,
              },
            ]}
          >
            <View style={styles.left}>
              <Text style={[styles.position, { color: colors.textPrimary }]}>
                #{row.position}
              </Text>
              <View style={styles.playerBlock}>
                <Text
                  style={[styles.playerName, { color: colors.textPrimary }]}
                >
                  {row.participantName}
                </Text>
                {isViewer ? (
                  <Text style={[styles.you, { color: colors.accent }]}>
                    You
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={styles.right}>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>
                P {row.played}
              </Text>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>
                W {row.wins}
              </Text>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>
                D {row.draws}
              </Text>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>
                L {row.losses}
              </Text>
              <Text style={[styles.points, { color: colors.textPrimary }]}>
                {row.points} pts
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  right: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  position: {
    fontSize: 15,
    fontWeight: "800",
    width: 28,
  },
  playerBlock: {
    gap: 2,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  you: {
    fontSize: 12,
    fontWeight: "700",
  },
  stat: {
    fontSize: 12,
  },
  points: {
    fontSize: 13,
    fontWeight: "800",
  },
  empty: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
