import TournamentDetailTabs from "@/components/tournament/TournamentDetailTabs";
import TournamentHero from "@/components/tournament/TournamentHeroCard";
import TournamentPrimaryAction from "@/components/tournament/TournamentPrimaryAction";
import TournamentTabContent from "@/components/tournament/TournamentTabContent";
import {
  useJoinTournament,
  useLeaveTournament,
  useTournamentDetail,
} from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentTabKey } from "@/types/tournament";
import { getTournamentUIConfig } from "@/components/ui/TournamentUi";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentDetailScreen() {
  const { colors } = useTheme();
  const { tournamentId } = useLocalSearchParams<{ tournamentId?: string }>();

  const resolvedTournamentId =
    typeof tournamentId === "string" ? tournamentId : "";

  const {
    data: tournament,
    isLoading,
    isError,
    refetch,
  } = useTournamentDetail(resolvedTournamentId);

  const joinMutation = useJoinTournament(resolvedTournamentId);
  const leaveMutation = useLeaveTournament(resolvedTournamentId);

  const uiConfig = useMemo(
    () => (tournament ? getTournamentUIConfig(tournament) : null),
    [tournament],
  );

  const [activeTab, setActiveTab] = useState<TournamentTabKey>("overview");

  useEffect(() => {
    if (uiConfig) {
      setActiveTab(uiConfig.defaultTab);
    }
  }, [uiConfig]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError || !tournament) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.errorCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
            Could not load tournament
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Please try refreshing the page.
          </Text>
          <Text
            onPress={() => refetch()}
            style={[styles.retryText, { color: colors.primary }]}
          >
            Retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TournamentHero
          tournament={tournament}
          showProgress={uiConfig?.showProgress}
          showWinnerBanner={uiConfig?.showWinnerBanner}
          showViewerRegistrationState={uiConfig?.showViewerRegistrationState}
        />

        {uiConfig?.showPrimaryAction ? (
          <TournamentPrimaryAction
            tournament={tournament}
            joining={joinMutation.isPending}
            leaving={leaveMutation.isPending}
            onJoin={() => joinMutation.mutate()}
            onLeave={() => leaveMutation.mutate()}
          />
        ) : null}

        <TournamentDetailTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          visibleTabs={uiConfig?.visibleTabs ?? ["overview"]}
        />

        <TournamentTabContent activeTab={activeTab} tournament={tournament} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    width: "100%",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  retryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
  },
});
