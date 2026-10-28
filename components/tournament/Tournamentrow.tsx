import React from "react";
import { StyleSheet, View } from "react-native";
import { AppCard } from "@/components/ui/AppCard";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentSummary } from "@/types/tournament";
import TournamentActions from "./TournamentActions";
import TournamentHeader from "./TournamentHeader";
import TournamentParticipants from "./TournamentParticipantsTab";
import TournamentProgress from "./TournamentProgress";
import TournamentTimeline from "./TournamentTimeline";

interface TournamentRowProps {
  tournament: TournamentSummary;
  onJoin?: () => void;
  onView?: () => void;
}

export default function TournamentRow({
  tournament,
  onJoin,
  onView,
}: TournamentRowProps) {
  const { colors } = useTheme();

  return (
    <AppCard
      variant="default"
      padding="lg"
      radiusSize="lg"
      style={[styles.card, { borderColor: colors.border }]}
      accessibilityLabel={`Tournament: ${tournament.name}`}
    >
      <TournamentHeader
        name={tournament.name}
        type={tournament.type}
        status={tournament.status}
      />
      <TournamentParticipants
        current={tournament.participantCount}
        max={tournament.maxParticipants}
      />
      <TournamentTimeline startDate={tournament.startDate} />
      <TournamentProgress
        currentMatchday={tournament.currentMatchday}
        totalMatchdays={tournament.totalMatchdays}
      />
      <TournamentActions
        canJoin={tournament.status === "registration" && !tournament.viewerIsRegistered}
        onJoin={onJoin}
        onView={onView}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
