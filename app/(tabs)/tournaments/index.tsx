import { TournamentList } from "@/components/tournament/TournamentList";
import { TournamentTabs } from "@/components/tournament/TournamentTabs";
import { useAllTournaments } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament, TournamentStatus } from "@/types/tournament";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const [tab, setTab] = useState<TournamentStatus | "all">("all");

    const {
        data: tournaments = [],
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useAllTournaments();

    const filtered =
        tab === "all"
            ? tournaments
            : tournaments.filter((t) => t.status === tab);

    function handleSelect(tournament: Tournament) {
        router.push({
            pathname: "/tournaments/[tournamentId]",
            params: { tournamentId: tournament.id },
        });
    }

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
        >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Tournaments
                </Text>
            </View>
            <TournamentTabs
                activeTab={tab}
                tournaments={tournaments}
                onChange={setTab}
            />
            <TournamentList
                tournaments={filtered}
                loading={isLoading}
                error={isError}
                refreshing={isRefetching}
                onRefresh={refetch}
                onSelect={handleSelect}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
});