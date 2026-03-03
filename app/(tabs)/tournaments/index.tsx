import { TournamentRow } from "@/components/tournament/Tournamentrow";
import { useGroupTournaments } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament, TournamentStatus } from "@/types/tournament";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator, FlatList, RefreshControl,
    StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: { label: string; value: TournamentStatus }[] = [
    { label: "Active", value: "ongoing" },
    { label: "Registration", value: "registration" },
    { label: "Completed", value: "completed" },
];

const EMPTY_MSG: Record<TournamentStatus, string> = {
    ongoing: "No active tournaments right now.",
    registration: "No open tournaments at the moment.",
    completed: "No completed tournaments yet.",
};

export default function TournamentsScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { groupId, groupName } = useLocalSearchParams<{ groupId: string; groupName?: string }>();

    const [tab, setTab] = useState<TournamentStatus>("registration");

    const { data: tournaments = [], isLoading, isError, refetch, isRefetching } =
        useGroupTournaments(groupId);

    // Auto-select most relevant tab after load
    useEffect(() => {
        if (!tournaments.length) return;
        const hasOngoing = tournaments.some((t) => t.status === "ongoing");
        const hasReg = tournaments.some((t) => t.status === "registration");
        setTab(hasOngoing ? "ongoing" : hasReg ? "registration" : "completed");
    }, [tournaments.length]);

    const filtered = tournaments.filter((t) => t.status === tab);
    const accent = (colors as any).accent ?? colors.primary;

    function handleSelect(t: Tournament) {
        router.push({ pathname: "./[tournamentId]", params: { tournamentId: t.id } });
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
                <View style={styles.center}><ActivityIndicator color={accent} size="large" /></View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
                <View style={styles.center}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Failed to load tournaments.</Text>
                    <TouchableOpacity style={[styles.retryBtn, { borderColor: accent }]} onPress={() => refetch()}>
                        <Text style={[styles.retryText, { color: accent }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background ?? colors.surface }]}>
            <View style={[styles.nav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn} hitSlop={12}>
                    <Text style={[styles.navBackText, { color: accent }]}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {groupName ? `${groupName} · Tournaments` : "Tournaments"}
                </Text>
                <View style={styles.navBtn} />
            </View>

            <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                {TABS.map((t) => {
                    const active = t.value === tab;
                    const count = tournaments.filter((x) => x.status === t.value).length;
                    return (
                        <TouchableOpacity
                            key={t.value}
                            style={[styles.tab, active && { borderBottomColor: accent, borderBottomWidth: 2 }]}
                            onPress={() => setTab(t.value)}
                        >
                            <Text style={[styles.tabText, { color: active ? accent : colors.textSecondary }, active && { fontWeight: "700" }]}>
                                {t.label}
                            </Text>
                            {count > 0 && (
                                <View style={[styles.badge, { backgroundColor: active ? accent : colors.border }]}>
                                    <Text style={[styles.badgeText, { color: active ? "#fff" : colors.textSecondary }]}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(t) => t.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={accent} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Trophy size={40} color={colors.border} strokeWidth={1.5} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{EMPTY_MSG[tab]}</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TournamentRow tournament={item} isAdmin={false} expanded onPress={() => handleSelect(item)} />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
    errorText: { fontSize: 14, textAlign: "center" },
    retryBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
    retryText: { fontSize: 14, fontWeight: "600" },
    nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
    navBtn: { width: 60 },
    navBackText: { fontSize: 16, fontWeight: "600" },
    navTitle: { fontSize: 15, fontWeight: "700", flex: 1, textAlign: "center" },
    tabBar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
    tab: { flex: 1, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
    tabText: { fontSize: 13 },
    badge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
    badgeText: { fontSize: 10, fontWeight: "700" },
    list: { padding: 16, gap: 4, flexGrow: 1 },
    emptyText: { fontSize: 14, textAlign: "center", marginTop: 8 },
});