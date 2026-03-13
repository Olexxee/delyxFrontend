import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Flame, TrendingUp, Trophy, Users } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { useJoinTournament } from "@/hooks/useTournaments";

interface TournamentCardProps {
    tournament: Tournament;
    onPress?: () => void;    // navigate to detail
    style?: ViewStyle;
}

function fmt(iso?: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric",
    });
}

export default function TournamentCard({
    tournament,
    onPress,
    style,
}: TournamentCardProps) {
    const { colors, mode } = useTheme();
    const joinMutation = useJoinTournament(tournament.id);

    const participantCount = tournament.participantCount;
    const spotsLeft = tournament.maxParticipants - participantCount;
    const fill = tournament.maxParticipants > 0
        ? participantCount / tournament.maxParticipants
        : 0;
    const isAlmostFull = fill >= 0.75;

    const isRegistered = tournament.userContext?.isRegistered ?? false;
    const canJoin = tournament.status === "registration"
        && tournament.isRegistrationOpen
        && !isRegistered;

    const gradientColors: [string, string, string] =
        mode === "dark"
            ? ["#1A2540", "#0F1A35", "#0B1220"]
            : ["#EEF2FF", "#E0E9FF", "#D4E0FF"];

    function handleJoin() {
        joinMutation.mutate(undefined, {
            onError: (e: any) => console.warn("Join failed:", e?.message),
        });
    }

    return (
        <View style={[styles.wrapper, style]}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: colors.border }]}
            >
                {/* Badge row */}
                <View style={styles.badgeRow}>
                    <View style={[styles.typePill, { borderColor: colors.primary }]}>
                        <Text style={[styles.typePillText, { color: colors.primary }]}>
                            {tournament.type}
                        </Text>
                    </View>

                    {isAlmostFull && (
                        <View style={[styles.alertPill, { backgroundColor: colors.warning + "22", borderColor: colors.warning }]}>
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

                    <View style={[styles.statusBadge, { borderColor: colors.accent, backgroundColor: colors.accent + "18", marginLeft: "auto" }]}>
                        <Text style={[styles.statusBadgeText, { color: colors.accent }]}>
                            {tournament.status}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleBlock}>
                    <View style={styles.titleRow}>
                        <Trophy size={16} color={colors.medal} strokeWidth={2} />
                        <Text style={[styles.tournamentName, { color: colors.textPrimary }]} numberOfLines={1}>
                            {tournament.name}
                        </Text>
                    </View>
                    {tournament.description && (
                        <Text style={[styles.description, { color: colors.primary }]} numberOfLines={1}>
                            {tournament.description}
                        </Text>
                    )}
                </View>

                {/* Stats */}
                <View style={[styles.statsGrid, { borderColor: colors.borderLight }]}>
                    <View style={styles.statItem}>
                        <Users size={14} color={colors.textSecondary} />
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                            {participantCount} / {tournament.maxParticipants}
                        </Text>
                        {spotsLeft > 0 && (
                            <Text style={[styles.statSub, { color: colors.textSecondary }]}>
                                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                            </Text>
                        )}
                    </View>

                    <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />

                    <View style={styles.statItem}>
                        <Calendar size={14} color={colors.textSecondary} />
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                            Register by
                        </Text>
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                            {fmt(tournament.registrationDeadline)}
                        </Text>
                    </View>

                    <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />

                    <View style={styles.statItem}>
                        <TrendingUp size={14} color={colors.textSecondary} />
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                            Starts
                        </Text>
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                            {fmt(tournament.startDate)}
                        </Text>
                    </View>
                </View>

                {/* Prize pool */}
                {tournament.prizePool && (
                    <View style={[styles.prizeBlock, { borderTopColor: colors.borderLight }]}>
                        <Text style={[styles.prizeLabel, { color: colors.textSecondary }]}>
                            Prize Pool
                        </Text>
                        <Text style={[styles.prizeAmount, { color: colors.medal }]}>
                            {tournament.prizePool}
                        </Text>
                    </View>
                )}

                {/* CTAs */}
                <View style={styles.ctaRow}>
                    {isRegistered ? (
                        // Already registered — show status + view button
                        <>
                            <View style={[styles.registeredBadge, { backgroundColor: colors.accent + "18", borderColor: colors.accent }]}>
                                <Text style={[styles.registeredText, { color: colors.accent }]}>
                                    ✓ Registered
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.viewBtn, { borderColor: colors.accent }]}
                                onPress={onPress}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.viewBtnText, { color: colors.accent }]}>View</Text>
                            </TouchableOpacity>
                        </>
                    ) : canJoin ? (
                        // Can join — show join + view
                        <>
                            <TouchableOpacity
                                style={[styles.joinBtn, { backgroundColor: colors.accent }, joinMutation.isPending && { opacity: 0.6 }]}
                                onPress={handleJoin}
                                disabled={joinMutation.isPending}
                                activeOpacity={0.85}
                            >
                                {joinMutation.isPending ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.joinBtnText}>Join Tournament</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.viewBtn, { borderColor: colors.accent }]}
                                onPress={onPress}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.viewBtnText, { color: colors.accent }]}>View</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        // Registration closed or completed — view only
                        <TouchableOpacity
                            style={[styles.ctaBtn, { backgroundColor: colors.accent }]}
                            onPress={onPress}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.ctaBtnText}>View Tournament</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
    card: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 14 },

    badgeRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
    typePill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    typePillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
    alertPill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    alertPillText: { fontSize: 11, fontWeight: "700" },
    heatBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
    heatText: { fontSize: 12, fontWeight: "600" },
    statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    statusBadgeText: { fontSize: 11, fontWeight: "700" },

    titleBlock: { gap: 4 },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    tournamentName: { fontSize: 17, fontWeight: "800", flex: 1, lineHeight: 22 },
    description: { fontSize: 13, lineHeight: 18 },

    statsGrid: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 12 },
    statItem: { flex: 1, gap: 3 },
    statValue: { fontSize: 12, fontWeight: "600", lineHeight: 17 },
    statSub: { fontSize: 11 },
    statDivider: { width: 1, height: 36, marginTop: 2 },

    prizeBlock: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, paddingTop: 12 },
    prizeLabel: { fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5 },
    prizeAmount: { fontSize: 20, fontWeight: "800" },

    ctaRow: { flexDirection: "row", gap: 8 },
    joinBtn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
    joinBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    viewBtn: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 20, alignItems: "center", borderWidth: 1 },
    viewBtnText: { fontSize: 14, fontWeight: "700" },
    ctaBtn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
    ctaBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    registeredBadge: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center", borderWidth: 1 },
    registeredText: { fontSize: 14, fontWeight: "700" },
});