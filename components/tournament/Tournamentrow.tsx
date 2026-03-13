import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import React from "react";
import { StyleSheet, View } from "react-native";
import TournamentActions from "./TournamentActions";
import TournamentHeader from "./TournamentHeader";
import TournamentParticipants from "./TournamentParticipants";
import TournamentProgress from "./TournamentProgress";
import TournamentTimeline from "./TournamentTimeline";

interface TournamentRowProps {
    tournament: Tournament;
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
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    shadowColor: colors.textPrimary,
                    borderColor: colors.border,
                },
            ]}
        >
            <TournamentHeader
                name={tournament.name}
                tournamentCode={tournament.tournamentCode}
                status={tournament.status}
            />

            <TournamentParticipants
                current={tournament.totalParticipantsCount}
                max={tournament.maxParticipants}
            />

            <TournamentTimeline
                startDate={tournament.startDate}
                endDate={tournament.endDate}
            />

            <TournamentProgress
                completed={tournament.completedMatches}
                total={tournament.totalMatches}
            />

            <TournamentActions
                canJoin={tournament.isRegistrationOpen}
                onJoin={onJoin}
                onView={onView}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        marginBottom: 12,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
});