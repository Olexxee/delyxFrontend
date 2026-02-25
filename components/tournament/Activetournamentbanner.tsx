import { ProgressBar, SectionCard } from "@/components/ui/groupInfoUi";
import type { ThemeColors, Tournament } from "@/types/group";
import { STATUS_META } from "@/types/group";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ActiveTournamentBannerProps {
    tournament: Tournament;
    colors: ThemeColors;
}

export function ActiveTournamentBanner({ tournament, colors }: ActiveTournamentBannerProps) {
    const meta = STATUS_META.active;
    const fill = tournament.participantCount / tournament.maxParticipants;

    return (
        <SectionCard colors={colors} style={styles.card}>
            {/* Header row */}
            <View style={styles.headerRow}>
                <View style={[styles.liveTag, { backgroundColor: meta.bg }]}>
                    <View style={styles.liveDot} />
                    <Text style={[styles.liveTagText, { color: meta.color }]}>LIVE</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Active Tournament
                </Text>
            </View>

            {/* Name */}
            <Text style={[styles.name, { color: colors.textPrimary }]}>
                {tournament.name}
            </Text>

            {/* Date */}
            <Text style={[styles.date, { color: colors.textSecondary }]}>
                Started {tournament.startDate}
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
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    card: { gap: 6 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    liveTag: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 5,
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#00e676" },
    liveTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
    sectionTitle: { fontSize: 15, fontWeight: "700" },
    name: { fontSize: 17, fontWeight: "700" },
    date: { fontSize: 12, marginTop: 2 },
    participantLabel: { fontSize: 12, marginTop: 10 },
    bar: { marginTop: 4 },
});