import { useTheme } from "../../theme/ThemeProvider";
import type { TournamentFixture } from "../../types/tournament";
import {
  formatTournamentDate,
  groupFixturesByMatchday,
  isViewerInFixture,
} from "../../utils/tournamentHelpers";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  fixtures: TournamentFixture[];
  viewerParticipantId?: string | null;
}

export default function TournamentFixturesTab({
  fixtures,
  viewerParticipantId,
}: Props) {
  const { colors } = useTheme();

  if (!fixtures.length) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          No fixtures yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Fixtures will appear here once they are generated.
        </Text>
      </View>
    );
  }

  const grouped = groupFixturesByMatchday(fixtures);
  const orderedMatchdays = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <View style={styles.container}>
      {orderedMatchdays.map((matchday) => (
        <View key={matchday} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Matchday {matchday}
          </Text>

          <View style={styles.fixtures}>
            {grouped[matchday].map((fixture) => {
              const isViewerFixture = isViewerInFixture(
                fixture,
                viewerParticipantId
              );

              return (
                <View
                  key={fixture.id}
                  style={[
                    styles.fixtureCard,
                    {
                      backgroundColor: isViewerFixture
                        ? `${colors.accent}14`
                        : colors.surface,
                      borderColor: isViewerFixture ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <View style={styles.row}>
                    <Text style={[styles.player, { color: colors.textPrimary }]}>
                      {fixture.homeParticipant.username}
                    </Text>

                    <Text style={[styles.vs, { color: colors.textSecondary }]}>
                      {fixture.homeScore != null && fixture.awayScore != null
                        ? `${fixture.homeScore} - ${fixture.awayScore}`
                        : "vs"}
                    </Text>

                    <Text style={[styles.player, { color: colors.textPrimary }]}>
                      {fixture.awayParticipant.username}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                      {fixture.status.replace("_", " ")}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                      {formatTournamentDate(fixture.scheduledDate)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  fixtures: {
    gap: 10,
  },
  fixtureCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  player: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  vs: {
    fontSize: 13,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  meta: {
    fontSize: 12,
    textTransform: "capitalize",
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