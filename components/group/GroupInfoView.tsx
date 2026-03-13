import { ActiveTournamentBanner } from "@/components/tournament/Activetournamentbanner";
import { TournamentsSection } from "@/components/tournament/Tournamentssection";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import type { ApiTournament, Tournament } from "@/types/tournament";
import { summaryToTournament } from "@/types/tournament";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo } from "react";
import {
    ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminControls, DangerZone } from "./Admincontrols";
import { GroupHero } from "./Grouphero";
import { LeaveGroupButton } from "./Leavegroupbutton";
import { MembersSection } from "./Memberssection";

type Props = {
    group: GroupOverview;
    onBack?: () => void;
    showHeader?: boolean;
};

export function GroupInfoView({ group, onBack, showHeader = true }: Props) {
    const { colors } = useTheme();
    const router = useRouter();

    const isAdmin = group.myRole === "admin";

    // ── Derived tournament lists ──────────────────────────────────────────────

    const visibleSummaries = useMemo(
        () =>
            isAdmin
                ? (group.tournamentsPreview ?? [])
                : (group.tournamentsPreview ?? []).filter((t) => t.status !== "ongoing"),
        [group.tournamentsPreview, isAdmin]
    );

    // Adapt TournamentSummary[] → Tournament[] for components that need the full shape
    const visibleTournaments: Tournament[] = useMemo(
        () => visibleSummaries.map((t) => summaryToTournament(t, group._id ?? group.id)),
        [visibleSummaries, group._id, group.id]
    );

    const activeTournament: Tournament | undefined = useMemo(() => {
        const summary = (group.tournamentsPreview ?? []).find((t) => t.status === "ongoing");
        return summary ? summaryToTournament(summary, group._id ?? group.id) : undefined;
    }, [group.tournamentsPreview, group._id, group.id]);

    // ── Navigation helpers ────────────────────────────────────────────────────

    function goToTournamentList() {
        router.push({ pathname: "/tournaments" });
    }

    function goToTournamentDetail(t: Tournament) {
        router.push({
            pathname: "/(tabs)/tournaments/[tournamentId]",
            params: { tournamentId: t.id },
        });
    }

    function handleTournamentCreated(_t: ApiTournament) {
        // Cache invalidation is handled inside useCreateTournament's onSuccess.
        // If GroupOverview is react-query cached, also invalidate it here:
        // queryClient.invalidateQueries({ queryKey: ["group", group._id] });
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
            {showHeader && (
                <View style={[styles.navBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                    {onBack ? (
                        <TouchableOpacity onPress={onBack} style={styles.navBtn}>
                            <ChevronLeft size={26} color={colors.textPrimary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.navBtn} />
                    )}
                    <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Group Info</Text>
                    <View style={styles.navBtn} />
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <GroupHero
                    group={group}
                    isAdmin={isAdmin}
                    visibleTournamentsCount={visibleTournaments.length}
                    colors={colors}
                />

                {activeTournament && (
                    <TouchableOpacity
                        onPress={() => goToTournamentDetail(activeTournament)}
                        activeOpacity={0.85}
                    >
                        <ActiveTournamentBanner tournament={activeTournament} colors={colors} />
                    </TouchableOpacity>
                )}


                <TournamentsSection
                    tournaments={visibleTournaments}
                    isAdmin={isAdmin}
                    groupId={group._id ?? group.id}
                    onViewAll={goToTournamentList}
                    onSelectTournament={goToTournamentDetail}
                    onTournamentCreated={handleTournamentCreated}
                />

                <MembersSection members={group.membersPreview ?? []} />

                {isAdmin && (
                    <>
                        <AdminControls joinRequestCount={group.pendingJoinRequestCount} />
                        <DangerZone />
                    </>
                )}

                {!isAdmin && <LeaveGroupButton />}

                <View style={styles.bottomSpacer} />
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    scroll: { paddingBottom: 32 },
    navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
    navBtn: { width: 40, alignItems: "flex-start" },
    navTitle: { fontSize: 16, fontWeight: "700" },
    bottomSpacer: { height: 40 },
});