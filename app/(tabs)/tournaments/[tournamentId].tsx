import TournamentDetailTabs from "@/components/tournament/TournamentDetailTabs";
import TournamentHero from "@/components/tournament/TournamentHeroCard";
import TournamentPrimaryAction from "@/components/tournament/TournamentPrimaryAction";
import TournamentTabContent from "@/components/tournament/TournamentTabContent";
import { useJoinTournament, useLeaveTournament, useSubmitTournamentResult, useTournamentDetail, useTournamentLifecycle } from "@/hooks/useTournaments";
import { UserContext } from "@/authContext/UserContext";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentTabKey } from "@/types/tournament";
import { getTournamentUIConfig } from "@/components/ui/TournamentUi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const lifecycleActions = {
  DRAFT: [{ action: "open-registration", label: "Open registration" }],
  REGISTRATION_OPEN: [{ action: "close-registration", label: "Close registration" }],
  REGISTRATION_CLOSED: [{ action: "generate-fixtures", label: "Generate fixtures" }],
  READY: [{ action: "start", label: "Start tournament" }],
  IN_PROGRESS: [
    { action: "advance-round", label: "Advance round" },
    { action: "complete", label: "Complete tournament" },
  ],
} as const;

export default function TournamentDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { tournamentId } = useLocalSearchParams<{ tournamentId?: string }>();
  const resolvedTournamentId = typeof tournamentId === "string" ? tournamentId : "";
  const { data: tournament, isLoading, isError, refetch } = useTournamentDetail(resolvedTournamentId);
  const joinMutation = useJoinTournament(resolvedTournamentId);
  const leaveMutation = useLeaveTournament(resolvedTournamentId);
  const groupId = tournament?.groupId ?? "";
  const lifecycleMutation = useTournamentLifecycle(groupId, resolvedTournamentId);
  const resultMutation = useSubmitTournamentResult(groupId, resolvedTournamentId);
  const [submittingFixtureId, setSubmittingFixtureId] = useState<string | null>(null);

  const uiConfig = useMemo(() => (tournament ? getTournamentUIConfig(tournament) : null), [tournament]);
  const [activeTab, setActiveTab] = useState<TournamentTabKey>("overview");

  useEffect(() => {
    if (uiConfig) setActiveTab(uiConfig.defaultTab);
  }, [uiConfig]);

  const reportResult = (fixtureId: string, homeScore: number, awayScore: number) => {
    setSubmittingFixtureId(fixtureId);
    resultMutation.mutate({ fixtureId, homeScore, awayScore }, {
      onSuccess: () => Alert.alert("Result submitted", "Your score report is pending administrator review."),
      onError: (error) => Alert.alert("Could not submit result", error instanceof Error ? error.message : "Please try again."),
      onSettled: () => setSubmittingFixtureId(null),
    });
  };

  if (isLoading) {
    return <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></SafeAreaView>;
  }

  if (isError || !tournament) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.centeredContent}>
          <View style={[styles.errorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Could not load tournament</Text>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>Please try refreshing the page.</Text>
            <Text onPress={() => refetch()} style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const lifecycleStatus = tournament.lifecycleStatus ?? "";
  const viewerRole = (tournament.viewerContext.role ?? "").toUpperCase();
  const canManage = tournament.viewerContext.canManage || tournament.createdBy === user?.id || viewerRole === "OWNER" || viewerRole === "ADMIN";
  const actions = canManage ? lifecycleActions[lifecycleStatus as keyof typeof lifecycleActions] ?? [] : [];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TournamentHero tournament={tournament} showProgress={uiConfig?.showProgress} showWinnerBanner={uiConfig?.showWinnerBanner} showViewerRegistrationState={uiConfig?.showViewerRegistrationState} />

        {actions.length > 0 && (
          <View style={[styles.managementPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.managementTitle, { color: colors.textPrimary }]}>Tournament management</Text>
            <Text style={[styles.managementHint, { color: colors.textSecondary }]}>Current stage: {lifecycleStatus.replace(/_/g, " ").toLowerCase()}</Text>
            {actions.map(({ action, label }) => (
              <Pressable
                key={action}
                accessibilityRole="button"
                disabled={lifecycleMutation.isPending}
                onPress={() => Alert.alert(label, `Are you sure you want to ${label.toLowerCase()}?`, [
                  { text: "Cancel", style: "cancel" },
                  { text: "Continue", onPress: () => lifecycleMutation.mutate(action, {
                    onSuccess: (result) => Alert.alert("Tournament updated", result.message),
                    onError: (error) => Alert.alert("Action failed", error instanceof Error ? error.message : "Please try again."),
                  }) },
                ])}
                style={({ pressed }) => [styles.managementButton, { backgroundColor: colors.primary, opacity: lifecycleMutation.isPending ? 0.55 : pressed ? 0.8 : 1 }]}
              >
                {lifecycleMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.managementButtonText}>{label}</Text>}
              </Pressable>
            ))}
          </View>
        )}

        {uiConfig?.showPrimaryAction ? (
          <TournamentPrimaryAction tournament={tournament} joining={joinMutation.isPending} leaving={leaveMutation.isPending} onJoin={() => joinMutation.mutate()} onLeave={() => leaveMutation.mutate()} />
        ) : null}

        <TournamentDetailTabs activeTab={activeTab} onChange={setActiveTab} visibleTabs={uiConfig?.visibleTabs ?? ["overview"]} />
        <TournamentTabContent
          activeTab={activeTab}
          tournament={tournament}
          onSubmitResult={reportResult}
          submittingFixtureId={submittingFixtureId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backButton: { paddingHorizontal: 16, paddingVertical: 12, alignSelf: "flex-start" },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  centeredContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorCard: { borderWidth: 1, borderRadius: 8, padding: 20, gap: 8, width: "100%" },
  errorTitle: { fontSize: 18, fontWeight: "800" },
  errorText: { fontSize: 14, lineHeight: 20 },
  retryText: { marginTop: 8, fontSize: 14, fontWeight: "700" },
  managementPanel: { borderWidth: 1, padding: 14, gap: 10 },
  managementTitle: { fontSize: 15, fontWeight: "800" },
  managementHint: { fontSize: 12, textTransform: "capitalize" },
  managementButton: { minHeight: 44, justifyContent: "center", alignItems: "center", paddingHorizontal: 14 },
  managementButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
