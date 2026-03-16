import TournamentCTAs from "@/components/tournament/Tournamentctas";
import TournamentHeroCard from "@/components/tournament/TournamentHeroCard";
import TournamentProgress from "@/components/tournament/TournamentProgress";
import TournamentRulesCard from "@/components/tournament/Tournamentrulescard";
import {
    useJoinTournament,
    useLeaveTournament,
    useTournamentDetail,
} from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Copy, Share2 } from "lucide-react-native";
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
    const participantCount =
        tournament.participantCount ?? tournament.totalParticipantsCount ?? 0;
    const isRegistered = tournament.userContext?.isRegistered ?? false;
    const canJoin =
        tournament.status === "registration" &&
        tournament.isRegistrationOpen &&
        !isRegistered;
    const isMutating = joinMutation.isPending || leaveMutation.isPending;
    const showProgress = (tournament.totalMatchdays ?? 0) > 0;

    // ── Handlers ──────────────────────────────────────────────────────────────
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

    function handleLeave() {
        leaveMutation.mutate(undefined, {
            onError: (e: any) =>
                Alert.alert("Error", e?.message ?? "Failed to leave."),
        });
    }

    // function handleViewFixtures() {
    //     router.push({
    //         pathname: "/tournaments/[tournamentId]/fixtures",
    //         params: { tournamentId },
    //     });
    // }

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
                <Text style={[styles.navTitle, { color: colors.textPrimary }]} numberOfLines={1}>
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
                <TournamentHeroCard
                    tournament={tournament}
                    participantCount={participantCount}
                    canJoin={canJoin}
                />

                <TournamentRulesCard settings={tournament.settings} />

                {showProgress && (
                    <TournamentProgress
                        completed={tournament.completedMatches ?? 0}
                        total={tournament.totalMatches ?? 0}
                        currentMatchday={tournament.currentMatchday}
                        totalMatchdays={tournament.totalMatchdays}
                        asCard
                    />
                )}

                <TournamentCTAs
                    tournament={tournament}
                    isRegistered={isRegistered}
                    canJoin={canJoin}
                    isMutating={isMutating}
                    isLeavePending={leaveMutation.isPending}
                    onJoin={handleJoin}
                    onLeave={handleLeave} onViewFixtures={function (): void {
                        throw new Error("Function not implemented.");
                    }}                    // onViewFixtures={handleViewFixtures}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

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
});