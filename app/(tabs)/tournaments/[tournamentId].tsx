import {
    useJoinTournament,
    useLeaveTournament,
    useTournamentDetail,
} from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import { STATUS_META } from "@/types/tournament";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Calendar,
    ChevronLeft,
    Copy,
    Flame,
    Hash,
    Share2,
    TrendingUp,
    Trophy,
    Users,
} from "lucide-react-native";
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

    const {
        data: tournament,
        isLoading,
        isError,
        refetch,
    } = useTournamentDetail(tournamentId);

    const joinMutation = useJoinTournament(tournamentId);
    const leaveMutation = useLeaveTournament(tournamentId, tournament?.groupId ?? "");

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
                <View style={styles.center}>
                    <ActivityIndicator color={colors.accent} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (isError || !tournament) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
                <View style={styles.center}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                        Failed to load tournament.
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryBtn, { borderColor: colors.accent }]}
                        onPress={() => refetch()}
                    >
                        <Text style={[styles.retryText, { color: colors.accent }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Derived state ─────────────────────────────────────────────────────────
    const meta = STATUS_META[tournament.status];
    const fillPercent =
        tournament.maxParticipants > 0
            ? Math.round((tournament.participantCount / tournament.maxParticipants) * 100)
            : 0;
    const spotsLeft = tournament.maxParticipants - tournament.participantCount;
    const isAlmostFull = fillPercent >= 75 && fillPercent < 100;
    const isOngoing = tournament.status === "ongoing";
    const isCompleted = tournament.status === "completed";
    const isRegistered = tournament.userContext?.isRegistered ?? false;
    const canJoin = tournament.status === "registration" && tournament.isRegistrationOpen && !isRegistered;
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

    function fmt(registrationDeadline: string): React.ReactNode {
        throw new Error("Function not implemented.");
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>

            {/* Nav bar */}
            <View
                style={[
                    styles.nav,
                    { backgroundColor: colors.surface, borderBottomColor: colors.border },
                ]}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn} hitSlop={12}>
                    <ChevronLeft size={24} color={colors.accent} />
                </TouchableOpacity>
                <Text
                    style={[styles.navTitle, { color: colors.textPrimary }]}
                    numberOfLines={1}
                >
                    Tournament
                </Text>
                <View style={styles.navIconRow}>
                    <TouchableOpacity hitSlop={8}>
                        <Share2 size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={8}>
                        <Copy size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.body}
            >
                {/* ── Hero card ── */}
                <View
                    style={[
                        styles.heroCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    {/* Badge row */}
                    <View style={styles.badgeRow}>
                        <View style={[styles.typePill, { borderColor: colors.primary }]}>
                            <Text style={[styles.typePillText, { color: colors.primary }]}>
                                {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)}
                            </Text>
                        </View>

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

                        {tournament.heatScore != null && (
                            <View style={styles.heatBadge}>
                                <Flame size={12} color={colors.warning} fill={colors.warning} />
                                <Text style={[styles.heatText, { color: colors.textSecondary }]}>
                                    {tournament.heatScore}
                                </Text>
                            </View>
                        )}

                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    borderColor: meta.color,
                                    backgroundColor: meta.color + "18",
                                    marginLeft: "auto",
                                },
                            ]}
                        >
                            {isOngoing && (
                                <View
                                    style={[styles.statusDot, { backgroundColor: colors.primary }]}
                                />
                            )}
                            <Text style={[styles.statusBadgeText, { color: meta.color }]}>
                                {meta.label}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
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
                            <Text style={[styles.description, { color: colors.primary }]}>
                                {tournament.description}
                            </Text>
                        ) : null}
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Stats grid */}
                    <View style={styles.statsGrid}>
                        <StatItem
                            icon={<Users size={14} color={colors.textSecondary} />}
                            value={`${tournament.participantCount} / ${tournament.maxParticipants}`}
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
                                    ? `Register before ${tournament.registrationDeadline ?? tournament.startDate}`
                                    : isCompleted
                                        ? `Ended ${tournament.endDate}`
                                        : `${tournament.startDate}${tournament.endDate ? ` – ${tournament.endDate}` : ""}`
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
                                        ? `Round of ${tournament.maxParticipants}`
                                        : tournament.startDate
                                            ? `Starts ${tournament.startDate}`
                                            : "—"
                            }
                            colors={colors}
                        />
                    </View>

                    {/* Participant fill bar */}
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

                {/* ── Rules & Points card ── */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                        Rules & Points
                    </Text>
                    <View style={styles.rulesGrid}>
                        <RuleItem label="Win" value={`+${tournament.settings.pointsForWin} pts`} color={colors.accent} labelColor={""} />
                        <RuleItem label="Draw" value={`+${tournament.settings.pointsForDraw} pt`} color={colors.warning} labelColor={""} />
                        <RuleItem label="Loss" value={`${tournament.settings.pointsForLoss} pts`} color={colors.danger} labelColor={""} />
                        <RuleItem
                            label="Format"
                            value={`${tournament.settings.rounds === "double" ? "Double" : "Single"} round-robin`}
                            color={colors.textSecondary}
                            labelColor={colors.textSecondary}
                        />
                    </View>
                </View>

                {/* ── Matchday progress (ongoing only) ── */}
                {tournament.totalMatchdays > 0 && (
                    <View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                            Progress
                        </Text>
                        <View style={styles.progressRow}>
                            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                Matchday {tournament.currentMatchday} of {tournament.totalMatchdays}
                            </Text>
                            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                {tournament.completedMatches}/{tournament.totalMatches} matches played
                            </Text>
                        </View>
                        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                            <View
                                style={[
                                    styles.barFill,
                                    {
                                        backgroundColor: colors.primary,
                                        width: `${tournament.totalMatches > 0 ? Math.round((tournament.completedMatches / tournament.totalMatches) * 100) : 0}%` as any,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                            {tournament.completedMatches} of {tournament.totalMatches} matches completed
                        </Text>
                    </View>
                )}

                {/* ── CTAs ── */}
                {canJoin && (
                    <TouchableOpacity
                        style={[
                            styles.joinBtn,
                            { backgroundColor: colors.accent },
                            isMutating && { opacity: 0.6 },
                        ]}
                        onPress={handleJoin}
                        disabled={isMutating}
                        activeOpacity={0.85}
                    >
                        {isMutating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.joinBtnText}>Join Tournament</Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Already registered — show status + leave option */}
                {isRegistered && tournament.status === "registration" && (
                    <View style={styles.registeredRow}>
                        <View style={[styles.registeredBadge, { backgroundColor: colors.accent + "18", borderColor: colors.accent }]}>
                            <Text style={[styles.registeredText, { color: colors.accent }]}>
                                ✓ Registered
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.leaveBtn, { borderColor: colors.danger }]}
                            onPress={() =>
                                Alert.alert(
                                    "Leave Tournament",
                                    "Are you sure you want to withdraw?",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Leave",
                                            style: "destructive",
                                            onPress: () =>
                                                leaveMutation.mutate(undefined, {
                                                    onError: (e: any) =>
                                                        Alert.alert("Error", e?.message ?? "Failed to leave."),
                                                }),
                                        },
                                    ]
                                )
                            }
                            disabled={isMutating}
                            activeOpacity={0.85}
                        >
                            {leaveMutation.isPending ? (
                                <ActivityIndicator color={colors.danger} size="small" />
                            ) : (
                                <Text style={[styles.leaveBtnText, { color: colors.danger }]}>Leave</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {isCompleted && (
                    <TouchableOpacity
                        style={[styles.viewResultsBtn, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                        activeOpacity={0.85}
                    >
                        <Trophy size={16} color={colors.medal} />
                        <Text style={[styles.viewResultsBtnText, { color: colors.textPrimary }]}>
                            View Results
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Registration deadline notice */}
                {tournament.status === "registration" && tournament.registrationDeadline ? (
                    <Text style={[styles.deadlineNote, { color: colors.textSecondary }]}>
                        Registration closes {fmt(tournament.registrationDeadline)}
                    </Text>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────

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

function RuleItem({
    label,
    value,
    color,
    labelColor,
}: {
    label: string;
    value: string;
    color: string;
    labelColor: string;
}) {
    return (
        <View style={styles.ruleItem}>
            <Text style={{ color: labelColor, fontSize: 11 }}>{label}</Text>
            <Text style={[styles.ruleValue, { color }]}>{value}</Text>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
    errorText: { fontSize: 14 },
    retryBtn: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    retryText: { fontSize: 14, fontWeight: "600" },

    // Nav
    nav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    navBtn: { width: 40 },
    navTitle: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center" },
    navIconRow: {
        flexDirection: "row",
        gap: 14,
        width: 40,
        justifyContent: "flex-end",
    },

    body: { padding: 16, gap: 12, paddingBottom: 48 },

    // Hero card
    heroCard: {
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
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusBadgeText: { fontSize: 11, fontWeight: "700" },

    // Title block
    titleBlock: { gap: 4 },
    tournamentName: { fontSize: 22, fontWeight: "800", lineHeight: 28 },
    codeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    codeText: { fontSize: 12 },
    description: { fontSize: 14, lineHeight: 20 },
    divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },

    // Stats grid
    statsGrid: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },
    statItem: { flex: 1, gap: 4 },
    statValue: { fontSize: 12, fontWeight: "600", lineHeight: 17 },
    statSub: { fontSize: 11 },
    statDivider: { width: 1, height: 36, marginTop: 2 },

    // Bar
    barSection: { gap: 5 },
    barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
    barFill: { height: "100%", borderRadius: 3 },
    barLabel: { fontSize: 11 },

    // Generic card
    card: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    cardTitle: { fontSize: 15, fontWeight: "700" },

    // Rules
    rulesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    ruleItem: { width: "45%", gap: 2 },
    ruleValue: { fontSize: 14, fontWeight: "700" },

    // Progress
    progressRow: { gap: 4 },
    progressText: { fontSize: 13 },

    // CTAs
    joinBtn: {
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 4,
    },
    joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    viewResultsBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
        marginTop: 4,
    },
    viewResultsBtnText: { fontSize: 16, fontWeight: "600" },
    deadlineNote: { fontSize: 12, textAlign: "center", marginTop: -4 },

    // Registered + leave row
    registeredRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        alignItems: "center",
    },
    registeredBadge: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
        alignItems: "center",
    },
    registeredText: { fontSize: 16, fontWeight: "700" },
    leaveBtn: {
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    leaveBtnText: { fontSize: 14, fontWeight: "700" },
});