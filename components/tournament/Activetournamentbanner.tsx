import { ProgressBar, SectionCard } from "@/components/ui/groupInfoUi";
import type { ThemeColors } from "@/types/group";
import type { Tournament } from "@/types/tournament";
import { STATUS_META } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ActiveTournamentBannerProps {
    tournament: Tournament;
    colors: ThemeColors;
}

export function ActiveTournamentBanner({ tournament, colors }: ActiveTournamentBannerProps) {
    const meta = STATUS_META[tournament.status];
    const fill = tournament.maxParticipants > 0
        ? tournament.participantCount / tournament.maxParticipants
        : 0;

    return (
        <SectionCard colors={colors} style={styles.card}>

            {/* Header row */}
            <View style={styles.headerRow}>
                <View style={[styles.liveTag, { backgroundColor: meta.bg }]}>
                    <View style={[styles.liveDot, { backgroundColor: meta.color }]} />
                    <Text style={[styles.liveTagText, { color: meta.color }]}>
                        {meta.label}
                    </Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Active Tournament
                </Text>
            </View>

            {/* Name */}
            <Text style={[styles.name, { color: colors.textPrimary }]}>
                {tournament.name}
            </Text>

            {/* Tournament code */}
            <Text style={[styles.code, { color: colors.textSecondary }]}>
                #{tournament.tournamentCode}
            </Text>

            {/* Date */}
            <Text style={[styles.date, { color: colors.textSecondary }]}>
                Started {tournament.startDate}
                {tournament.endDate ? `  ·  Ends ${tournament.endDate}` : ""}
            </Text>

            {/* Participant count + bar */}
            <Text style={[styles.participantLabel, { color: colors.textSecondary }]}>
                {tournament.participantCount}/{tournament.maxParticipants} participants
            </Text>
            <ProgressBar
                fill={fill}
                color={meta.color}
                trackColor={colors.border}
                style={styles.bar}
            />

            {/* Matchday progress — only shown once tournament has started */}
            {tournament.totalMatchdays > 0 && (
                <Text style={[styles.matchday, { color: colors.textSecondary }]}>
                    Matchday {tournament.currentMatchday} of {tournament.totalMatchdays}
                    {"  ·  "}
                    {tournament.completedMatches}/{tournament.totalMatches} matches played
                </Text>
            )}

        </SectionCard>
    );
}

const styles = StyleSheet.create({
    card: { gap: 6 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    liveTag: { flexDirection: "row", alignItems: "center", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, gap: 5 },
    liveDot: { width: 6, height: 6, borderRadius: 3 },
    liveTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
    sectionTitle: { fontSize: 15, fontWeight: "700" },
    name: { fontSize: 17, fontWeight: "700" },
    code: { fontSize: 11, marginTop: 1 },
    date: { fontSize: 12, marginTop: 2 },
    participantLabel: { fontSize: 12, marginTop: 10 },
    bar: { marginTop: 4 },
    matchday: { fontSize: 11, marginTop: 6 },
});