import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentFixture } from "@/types/tournament";
import { formatTournamentDate, groupFixturesByMatchday, isViewerInFixture } from "@/utils/tournamentHelpers";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  fixtures: TournamentFixture[];
  viewerParticipantId?: string | null;
  canSubmitResults?: boolean;
  submittingFixtureId?: string | null;
  onSubmitResult?: (fixtureId: string, homeScore: number, awayScore: number) => void;
}

export default function TournamentFixturesTab({
  fixtures,
  viewerParticipantId,
  canSubmitResults = false,
  submittingFixtureId,
  onSubmitResult,
}: Props) {
  const { colors } = useTheme();
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});

  if (!fixtures.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No fixtures yet</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Fixtures will appear here once registration is closed and the organizer generates the schedule.</Text>
      </View>
    );
  }

  const grouped = groupFixturesByMatchday(fixtures);
  const orderedMatchdays = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <View style={styles.container}>
      {orderedMatchdays.map((matchday) => (
        <View key={matchday} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Matchday {matchday}</Text>
          <View style={styles.fixtures}>
            {grouped[matchday].map((fixture) => {
              const isViewerFixture = isViewerInFixture(fixture, viewerParticipantId);
              const score = scores[fixture.id] ?? { home: "", away: "" };
              const isPending = fixture.status.toUpperCase() === "SUBMITTED" || fixture.status.toUpperCase() === "DISPUTED";
              const isVerified = fixture.status.toUpperCase() === "VERIFIED" || fixture.status.toUpperCase() === "COMPLETED";
              const canReport = canSubmitResults && isViewerFixture && !isVerified && !isPending;

              return (
                <View key={fixture.id} style={[styles.fixtureCard, {
                  backgroundColor: isViewerFixture ? `${colors.accent}14` : colors.surface,
                  borderColor: isViewerFixture ? colors.accent : colors.border,
                }]}>
                  <View style={styles.row}>
                    <Text style={[styles.player, { color: colors.textPrimary }]}>{fixture.homeParticipant.username}</Text>
                    <Text style={[styles.vs, { color: colors.textSecondary }]}>
                      {fixture.homeScore != null && fixture.awayScore != null ? `${fixture.homeScore} - ${fixture.awayScore}` : "vs"}
                    </Text>
                    <Text style={[styles.player, { color: colors.textPrimary }]}>{fixture.awayParticipant.username}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>{fixture.status.replace(/_/g, " ")}</Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>{formatTournamentDate(fixture.scheduledDate)}</Text>
                  </View>
                  {canReport && (
                    <View style={styles.reportSection}>
                      <Text style={[styles.reportTitle, { color: colors.textPrimary }]}>Submit match result</Text>
                      <View style={styles.scoreRow}>
                        <View style={styles.scoreInputWrap}>
                          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{fixture.homeParticipant.username}</Text>
                          <TextInput
                            accessibilityLabel={`${fixture.homeParticipant.username} score`}
                            keyboardType="number-pad"
                            value={score.home}
                            onChangeText={(home) => setScores((prev) => ({ ...prev, [fixture.id]: { ...score, home: home.replace(/[^0-9]/g, "") } }))}
                            placeholder="0"
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.scoreInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                          />
                        </View>
                        <Text style={[styles.vs, { color: colors.textSecondary }]}>–</Text>
                        <View style={styles.scoreInputWrap}>
                          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{fixture.awayParticipant.username}</Text>
                          <TextInput
                            accessibilityLabel={`${fixture.awayParticipant.username} score`}
                            keyboardType="number-pad"
                            value={score.away}
                            onChangeText={(away) => setScores((prev) => ({ ...prev, [fixture.id]: { ...score, away: away.replace(/[^0-9]/g, "") } }))}
                            placeholder="0"
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.scoreInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                          />
                        </View>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        disabled={!score.home.trim() || !score.away.trim() || submittingFixtureId === fixture.id}
                        onPress={() => onSubmitResult?.(fixture.id, Number(score.home), Number(score.away))}
                        style={({ pressed }) => [styles.submitButton, { backgroundColor: colors.primary, opacity: !score.home.trim() || !score.away.trim() || submittingFixtureId === fixture.id ? 0.55 : pressed ? 0.8 : 1 }]}
                      >
                        {submittingFixtureId === fixture.id ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit result for review</Text>}
                      </Pressable>
                    </View>
                  )}
                  {isPending && isViewerFixture && (
                    <Text style={[styles.pendingText, { color: colors.textSecondary }]}>Result submitted — awaiting administrator review.</Text>
                  )}
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
  container: { gap: 16 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  fixtures: { gap: 10 },
  fixtureCard: { borderWidth: 1, borderRadius: 8, padding: 14, gap: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8, alignItems: "center" },
  player: { flex: 1, fontSize: 13, fontWeight: "700" },
  vs: { fontSize: 13, fontWeight: "700" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  meta: { fontSize: 12, textTransform: "capitalize" },
  reportSection: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#8885", paddingTop: 12, gap: 10 },
  reportTitle: { fontSize: 13, fontWeight: "700" },
  scoreRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  scoreInputWrap: { flex: 1, gap: 5 },
  inputLabel: { fontSize: 11 },
  scoreInput: { borderWidth: 1, minHeight: 42, paddingHorizontal: 12, fontSize: 16 },
  submitButton: { minHeight: 42, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  submitText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  pendingText: { fontSize: 12, lineHeight: 18 },
  empty: { borderWidth: 1, borderRadius: 8, padding: 16, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700" },
  emptyText: { fontSize: 13, lineHeight: 18 },
});
