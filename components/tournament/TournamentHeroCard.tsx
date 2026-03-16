import { useTheme } from "@/theme/ThemeProvider";
import { STATUS_META } from "@/types/tournament";
import type { Tournament } from "@/types/tournament";
import { Calendar, Flame, Hash, TrendingUp, Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentStatusBadge from "./TournamentStatusBadge";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmt(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatItem({
    icon,
    value,
    sub,
    colors,
}: {
    icon: React.ReactNode;
    value: string;
    sub?: string;
    colors: any;
}) {
    return (
        <View style={styles.statItem}>
            {icon}
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
            {sub ? (
                <Text style={[styles.statSub, { color: colors.textSecondary }]}>{sub}</Text>
            ) : null}
        </View>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
    tournament: Tournament;
    participantCount: number;
    canJoin: boolean;
}

export default function TournamentHeroCard({ tournament, participantCount, canJoin }: Props) {
    const { colors } = useTheme();
    const meta = STATUS_META[tournament.status];

    const fillPercent =
        tournament.maxParticipants > 0
            ? Math.round((participantCount / tournament.maxParticipants) * 100)
            : 0;
    const spotsLeft = tournament.maxParticipants - participantCount;
    const isAlmostFull = fillPercent >= 75 && fillPercent < 100;
    const isOngoing = tournament.status === "ongoing";
    const isCompleted = tournament.status === "completed";

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            {/* ── Badge row ── */}
            <View style={styles.badgeRow}>
                {/* Type pill */}
                <View style={[styles.typePill, { borderColor: colors.primary }]}>
                    <Text style={[styles.typePillText, { color: colors.primary }]}>
                        {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)}
                    </Text>
                </View>

                {/* Almost full warning */}
                {isAlmostFull && (
                    <View
                        style={[
                            styles.alertPill,
                            {
                                backgroundColor: colors.warning + "22",
                                borderColor: colors.warning,
                            },
                        ]}
                    >
                        <Text style={[styles.alertPillText, { color: colors.warning }]}>
                            Almost Full
                        </Text>
                    </View>
                )}

                {/* Heat score */}
                {tournament.heatScore != null && (
                    <View style={styles.heatBadge}>
                        <Flame size={12} color={colors.warning} fill={colors.warning} />
                        <Text style={[styles.heatText, { color: colors.textSecondary }]}>
                            {tournament.heatScore}
                        </Text>
                    </View>
                )}

                {/* Status badge — pushed to the right */}
                <View style={styles.statusPush}>
                    <TournamentStatusBadge status={tournament.status} />
                </View>
            </View>

            {/* ── Title block ── */}
            <View style={styles.titleBlock}>
                <Text style={[styles.tournamentName, { color: colors.textPrimary }]}>
                    {tournament.name}
                </Text>
                <View style={styles.codeRow}>
                    <Hash size={12} color={colors.textSecondary} />
                    <Text style={[styles.codeText, { color: colors.textSecondary }]}>
                        {tournament.tournamentCode}
                    </Text>
                </View>
                {tournament.description ? (
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {tournament.description}
                    </Text>
                ) : null}
            </View>

            {/* ── Divider ── */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* ── Stats grid ── */}
            <View style={styles.statsGrid}>
                <StatItem
                    icon={<Users size={14} color={colors.textSecondary} />}
                    value={`${participantCount} / ${tournament.maxParticipants}`}
                    sub={
                        canJoin && spotsLeft > 0
                            ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`
                            : undefined
                    }
                    colors={colors}
                />

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <StatItem
                    icon={<Calendar size={14} color={colors.textSecondary} />}
                    value={
                        tournament.status === "registration"
                            ? `Register before ${fmt(tournament.registrationDeadline ?? tournament.startDate)}`
                            : isCompleted
                                ? `Ended ${fmt(tournament.endDate)}`
                                : `${fmt(tournament.startDate)}${tournament.endDate ? ` – ${fmt(tournament.endDate)}` : ""}`
                    }
                    colors={colors}
                />

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <StatItem
                    icon={<TrendingUp size={14} color={colors.textSecondary} />}
                    value={
                        isCompleted
                            ? "Completed"
                            : isOngoing && tournament.currentMatchday
                                ? `Matchday ${tournament.currentMatchday}`
                                : tournament.startDate
                                    ? `Starts ${fmt(tournament.startDate)}`
                                    : "—"
                    }
                    colors={colors}
                />
            </View>

            {/* ── Participant fill bar ── */}
            <View style={styles.barSection}>
                <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                    <View
                        style={[
                            styles.barFill,
                            {
                                backgroundColor: meta.color,
                                width: `${fillPercent}%` as any,
                            },
                        ]}
                    />
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                    {fillPercent}% filled
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },

    // Badge row
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
    },
    typePill: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    typePillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
    alertPill: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    alertPillText: { fontSize: 11, fontWeight: "700" },
    heatBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
    heatText: { fontSize: 12, fontWeight: "600" },
    statusPush: { marginLeft: "auto" },

    // Title
    titleBlock: { gap: 4 },
    tournamentName: { fontSize: 22, fontWeight: "800", lineHeight: 28 },
    codeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    codeText: { fontSize: 12 },
    description: { fontSize: 14, lineHeight: 20 },
    divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },

    // Stats grid
    statsGrid: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    statItem: { flex: 1, gap: 4 },
    statValue: { fontSize: 12, fontWeight: "600", lineHeight: 17 },
    statSub: { fontSize: 11 },
    statDivider: { width: 1, height: 36, marginTop: 2 },

    // Bar
    barSection: { gap: 5 },
    barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
    barFill: { height: "100%", borderRadius: 3 },
    barLabel: { fontSize: 11 },
});