import { useTournamentDetail, useJoinTournament, useLeaveTournament } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import { STATUS_META } from "@/types/tournament";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, ChevronLeft, Hash, Trophy, Users } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentDetailScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { tournamentId } = useLocalSearchParams<{ tournamentId: string }>();

    const { data: tournament, isLoading, isError, refetch } = useTournamentDetail(tournamentId);

    const joinMutation = useJoinTournament(tournamentId, tournament?.groupId ?? "");
    const leaveMutation = useLeaveTournament(tournamentId, tournament?.groupId ?? "");

    const accent = (colors as any).accent ?? colors.primary;

    // ── Loading ───────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
                <View style={styles.center}>
                    <ActivityIndicator color={accent} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────

    if (isError || !tournament) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
                <View style={styles.center}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                        Failed to load tournament.
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryBtn, { borderColor: accent }]}
                        onPress={() => refetch()}
                    >
                        <Text style={[styles.retryText, { color: accent }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Derived state ─────────────────────────────────────────────────────────

    const meta = STATUS_META[tournament.status];
    const fillPercent = tournament.maxParticipants > 0
        ? Math.round((tournament.participantCount / tournament.maxParticipants) * 100)
        : 0;
    const canJoin = tournament.status === "registration" && tournament.isRegistrationOpen;
    const isMutating = joinMutation.isPending || leaveMutation.isPending;

    function handleJoin() {
        Alert.alert(
            "Join Tournament",
            `Join "${tournament!.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Join",
                    onPress: () =>
                        joinMutation.mutate(undefined, {
                            onError: (e: any) =>
                                Alert.alert("Error", e?.message ?? "Failed to join."),
                        }),
                },
            ]
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>

            {/* Nav bar */}
            <View style={[styles.nav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn} hitSlop={12}>
                    <ChevronLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    Tournament
                </Text>
                <View style={styles.navBtn} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

                {/* ── Hero card ── */}
                <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                    {/* Status pill */}
                    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
                        <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                    </View>

                    {/* Name */}
                    <Text style={[styles.tournamentName, { color: colors.textPrimary }]}>
                        {tournament.name}
                    </Text>

                    {/* Code */}
                    <View style={styles.codeRow}>
                        <Hash size={13} color={colors.textSecondary} />
                        <Text style={[styles.codeText, { color: colors.textSecondary }]}>
                            {tournament.tournamentCode}
                        </Text>
                    </View>

                    {/* Description */}
                    {tournament.description ? (
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {tournament.description}
                        </Text>
                    ) : null}

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Meta grid */}
                    <View style={styles.metaGrid}>
                        <MetaItem icon={<Calendar size={15} color={colors.textSecondary} />} label="Starts" value={tournament.startDate} colors={colors} />
                        <MetaItem icon={<Calendar size={15} color={colors.textSecondary} />} label="Ends" value={tournament.endDate} colors={colors} />
                        <MetaItem icon={<Users size={15} color={colors.textSecondary} />} label="Participants" value={`${tournament.participantCount} / ${tournament.maxParticipants}`} colors={colors} />
                        <MetaItem icon={<Trophy size={15} color={colors.textSecondary} />} label="Type" value={tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} colors={colors} />
                    </View>

                    {/* Participant fill bar */}
                    <View style={styles.barSection}>
                        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                            <View
                                style={[
                                    styles.barFill,
                                    { backgroundColor: meta.color, width: `${fillPercent}%` },
                                ]}
                            />
                        </View>
                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                            {fillPercent}% filled
                        </Text>
                    </View>
                </View>

                {/* ── Settings card ── */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Rules & Points</Text>
                    <View style={styles.rulesGrid}>
                        <RuleItem label="Win" value={`+${tournament.settings.pointsForWin} pts`} color="#16a34a" />
                        <RuleItem label="Draw" value={`+${tournament.settings.pointsForDraw} pt`} color="#ca8a04" />
                        <RuleItem label="Loss" value={`${tournament.settings.pointsForLoss} pts`} color="#dc2626" />
                        <RuleItem label="Format" value={`${tournament.settings.rounds === "double" ? "Double" : "Single"} round-robin`} color={colors.textSecondary} />
                    </View>
                </View>

                {/* ── Matchday progress (only when started) ── */}
                {tournament.totalMatchdays > 0 && (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Progress</Text>
                        <View style={styles.progressRow}>
                            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                Matchday {tournament.currentMatchday} of {tournament.totalMatchdays}
                            </Text>
                            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                {tournament.completedMatches}/{tournament.totalMatches} matches played
                            </Text>
                        </View>
                    </View>
                )}

                {/* ── Join CTA ── */}
                {canJoin && (
                    <TouchableOpacity
                        style={[styles.joinBtn, { backgroundColor: accent }, isMutating && { opacity: 0.6 }]}
                        onPress={handleJoin}
                        disabled={isMutating}
                        activeOpacity={0.85}
                    >
                        {isMutating
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.joinBtnText}>Join Tournament</Text>
                        }
                    </TouchableOpacity>
                )}

                {/* Registration deadline notice */}
                {tournament.status === "registration" && tournament.registrationDeadline ? (
                    <Text style={[styles.deadlineNote, { color: colors.textSecondary }]}>
                        Registration closes {tournament.registrationDeadline}
                    </Text>
                ) : null}

            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function MetaItem({
    icon, label, value, colors,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    colors: any;
}) {
    return (
        <View style={styles.metaItem}>
            {icon}
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{value}</Text>
        </View>
    );
}

function RuleItem({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <View style={styles.ruleItem}>
            <Text style={[styles.ruleLabel, { color: "#6b7280" }]}>{label}</Text>
            <Text style={[styles.ruleValue, { color }]}>{value}</Text>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
    errorText: { fontSize: 14 },
    retryBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
    retryText: { fontSize: 14, fontWeight: "600" },

    nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
    navBtn: { width: 40 },
    navTitle: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center" },

    body: { padding: 16, gap: 12, paddingBottom: 48 },

    heroCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 18, gap: 10 },
    statusPill: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
    tournamentName: { fontSize: 22, fontWeight: "800", lineHeight: 28 },
    codeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    codeText: { fontSize: 12 },
    description: { fontSize: 14, lineHeight: 20 },
    divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },

    metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    metaItem: { width: "45%", gap: 3 },
    metaLabel: { fontSize: 11, fontWeight: "500" },
    metaValue: { fontSize: 14, fontWeight: "600" },

    barSection: { gap: 5, marginTop: 4 },
    barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
    barFill: { height: "100%", borderRadius: 3 },
    barLabel: { fontSize: 11 },

    card: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 },
    cardTitle: { fontSize: 15, fontWeight: "700" },

    rulesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    ruleItem: { width: "45%", gap: 2 },
    ruleLabel: { fontSize: 11 },
    ruleValue: { fontSize: 14, fontWeight: "700" },

    progressRow: { gap: 6 },
    progressText: { fontSize: 13 },

    joinBtn: { borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 4 },
    joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    deadlineNote: { fontSize: 12, textAlign: "center", marginTop: -4 },
});