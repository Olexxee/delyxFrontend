import { TournamentList } from "@/components/tournament/TournamentList";
import TournamentFilterTabs from "@/components/tournament/TournamentFilterTabs";
import { useAllTournaments } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus, TournamentSummary } from "@/types/tournament";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ListTab = TournamentStatus | "all";

export default function TournamentsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ListTab>("all");

  const {
    data: tournaments = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAllTournaments();

  const filteredTournaments = useMemo(() => {
    if (activeTab === "all") return tournaments;
    return tournaments.filter((tournament) => tournament.status === activeTab);
  }, [activeTab, tournaments]);

  const handleSelect = (tournament: TournamentSummary) => {
    router.push({
      pathname: "/tournaments/[tournamentId]",
      params: { tournamentId: tournament.id },
    });
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Tournaments
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Browse, track, and join active competitions.
        </Text>
      </View>

      <TournamentFilterTabs
        activeTab={activeTab}
        tournaments={tournaments}
        onChange={setActiveTab}
      />

      <TournamentList
        tournaments={filteredTournaments}
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
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
