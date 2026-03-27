import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentParticipant, TournamentStatus } from "@/types/tournament";
import { sortParticipantsForViewer } from "@/utils/tournamentHelpers";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  participants: TournamentParticipant[];
  viewerParticipantId?: string | null;
  maxParticipants: number;
  participantCount: number;
  status: TournamentStatus;
}

export default function TournamentParticipantsTab({
  participants,
  viewerParticipantId,
  maxParticipants,
  participantCount,
}: Props) {
  const { colors } = useTheme();

  const sortedParticipants = sortParticipantsForViewer(
    participants,
    viewerParticipantId
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.headerText, { color: colors.textSecondary }]}>
        {participantCount}/{maxParticipants} registered
      </Text>

      <View style={styles.grid}>
        {sortedParticipants.map((participant) => {
          const isViewer = participant.id === viewerParticipantId;

          return (
            <View
              key={participant.id}
              style={[
                styles.card,
                {
                  backgroundColor: isViewer ? `${colors.accent}14` : colors.surface,
                  borderColor: isViewer ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                {participant.username}
              </Text>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {participant.status}
                </Text>

                {isViewer ? (
                  <Text style={[styles.you, { color: colors.accent }]}>You</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerText: {
    fontSize: 13,
  },
  grid: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  you: {
    fontSize: 12,
    fontWeight: "700",
  },
});