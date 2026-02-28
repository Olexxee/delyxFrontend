import { ActiveTournamentBanner } from "@/components/tournament/Activetournamentbanner";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TournamentsModal, TournamentsSection } from "../tournament/Tournamentssection";
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

    const isAdmin = group.myRole === "admin";
    const [tournamentsModalVisible, setTournamentsModalVisible] = useState(false);

    const visibleTournaments = useMemo(
        () =>
            isAdmin
                ? (group.tournamentsPreview ?? [])
                : (group.tournamentsPreview ?? []).filter((t) => t.status !== "active"),
        [group.tournamentsPreview, isAdmin]
    );

    const activeTournament = (group.tournamentsPreview ?? []).find(
        (t) => t.status === "active"
    );

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
                    <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
                        Group Info
                    </Text>
                    <View style={styles.navBtn} />
                </View>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <GroupHero
                    group={group}
                    isAdmin={isAdmin}
                    visibleTournamentsCount={visibleTournaments.length}
                    colors={colors}
                />

                {activeTournament && (
                    <ActiveTournamentBanner tournament={activeTournament} colors={colors} />
                )}

                <TournamentsSection
                    tournaments={visibleTournaments}
                    isAdmin={isAdmin}
                    colors={colors}
                    onViewAll={() => setTournamentsModalVisible(true)}
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

            <TournamentsModal
                visible={tournamentsModalVisible}
                tournaments={visibleTournaments}
                isAdmin={isAdmin}
                colors={colors}
                onClose={() => setTournamentsModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scroll: {
        paddingBottom: 32,
    },
    navBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    navBtn: {
        width: 40,
        alignItems: "flex-start",
    },
    navTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    bottomSpacer: {
        height: 40,
    },
});