import { TournamentList } from "@/components/tournament/TournamentList";
import TournamentFilterTabs from "@/components/tournament/TournamentFilterTabs";
import { useAllTournaments } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus, TournamentSummary } from "@/types/tournament";
import { useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";
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
        <View style={styles.titleRow}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>THE COMPETITIVE EDGE</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Tournaments</Text>
          </View>
          <View style={[styles.iconTile, { backgroundColor: colors.surfaceLight }]}>
            <Trophy size={22} color={colors.accent} />
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find your next challenge. Earn your place.
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
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 9,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: { fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  iconTile: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
