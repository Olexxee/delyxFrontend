import TournamentDetailTabs from "@/components/tournament/TournamentDetailTabs";
import TournamentHero from "@/components/tournament/TournamentHeroCard";
import TournamentPrimaryAction from "@/components/tournament/TournamentPrimaryAction";
import TournamentTabContent from "@/components/tournament/TournamentTabContent";
import {
  useJoinTournament,
  useLeaveTournament,
  useTournamentDetail,
  useTournamentLifecycle,
  useUpdateTournamentSettings,
} from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentTabKey } from "@/types/tournament";
import { getTournamentUIConfig } from "@/components/ui/TournamentUi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
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
  const groupId = tournament?.groupId ?? "";
  const lifecycleMutation = useTournamentLifecycle(groupId, resolvedTournamentId);
  const settingsMutation = useUpdateTournamentSettings(groupId, resolvedTournamentId);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    description: "",
    maxParticipants: "16",
    pointsForWin: "3",
    pointsForDraw: "1",
    pointsForLoss: "0",
    rounds: "single" as "single" | "double",
    registrationMode: "OPEN" as "OPEN" | "APPROVAL" | "INVITE_ONLY",
    registrationOpensAt: "",
    registrationClosesAt: "",
    startsAt: "",
    endsAt: "",
  });

  const dateInput = (value?: string) => value ? value.slice(0, 10) : "";
  const openSettings = () => {
    if (!tournament) return;
    setSettingsForm({
      name: tournament.name,
      description: tournament.description ?? "",
      maxParticipants: String(tournament.maxParticipants || 16),
      pointsForWin: String(tournament.settings.pointsForWin),
      pointsForDraw: String(tournament.settings.pointsForDraw),
      pointsForLoss: String(tournament.settings.pointsForLoss),
      rounds: tournament.settings.rounds,
      registrationMode: tournament.registrationMode ?? "OPEN",
      registrationOpensAt: dateInput(tournament.registrationOpensAt ?? tournament.createdAt),
      registrationClosesAt: dateInput(tournament.registrationDeadline),
      startsAt: dateInput(tournament.startDate),
      endsAt: dateInput(tournament.endDate),
    });
    setSettingsVisible(true);
  };
  const saveSettings = () => {
    const maxParticipants = Number(settingsForm.maxParticipants);
    const pointsForWin = Number(settingsForm.pointsForWin);
    const pointsForDraw = Number(settingsForm.pointsForDraw);
    const pointsForLoss = Number(settingsForm.pointsForLoss);
    if (!settingsForm.name.trim()) return Alert.alert("Invalid settings", "Tournament name is required.");
    if (!Number.isInteger(maxParticipants) || maxParticipants < 2) return Alert.alert("Invalid settings", "Maximum participants must be at least 2.");
    if (![pointsForWin, pointsForDraw, pointsForLoss].every((value) => Number.isInteger(value) && value >= 0)) return Alert.alert("Invalid settings", "Points must be whole numbers and cannot be negative.");
    const dates = [settingsForm.registrationOpensAt, settingsForm.registrationClosesAt, settingsForm.startsAt, settingsForm.endsAt];
    if (dates.some((value) => !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(value).getTime()))) return Alert.alert("Invalid settings", "Enter all dates in YYYY-MM-DD format.");
    if (new Date(settingsForm.registrationClosesAt) < new Date(settingsForm.registrationOpensAt)) return Alert.alert("Invalid settings", "Registration must close after it opens.");
    if (new Date(settingsForm.startsAt) <= new Date(settingsForm.registrationClosesAt)) return Alert.alert("Invalid settings", "Tournament start must be after registration closes.");
    if (new Date(settingsForm.endsAt) <= new Date(settingsForm.startsAt)) return Alert.alert("Invalid settings", "Tournament end must be after its start.");
    settingsMutation.mutate({
      name: settingsForm.name.trim(),
      description: settingsForm.description.trim() || undefined,
      maxParticipants,
      pointsForWin,
      pointsForDraw,
      pointsForLoss,
      rounds: settingsForm.rounds,
      registrationMode: settingsForm.registrationMode,
      registrationOpensAt: new Date(settingsForm.registrationOpensAt + "T00:00:00.000Z").toISOString(),
      registrationClosesAt: new Date(settingsForm.registrationClosesAt + "T23:59:59.000Z").toISOString(),
      startsAt: new Date(settingsForm.startsAt + "T00:00:00.000Z").toISOString(),
      endsAt: new Date(settingsForm.endsAt + "T23:59:59.000Z").toISOString(),
    }, {
      onSuccess: (result) => {
        setSettingsVisible(false);
        Alert.alert("Settings saved", result.message);
      },
      onError: (error) => Alert.alert("Could not save settings", error instanceof Error ? error.message : "Please try again."),
    });
  };

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
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.centeredContent}>
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
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

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

        {Boolean(tournament.viewerContext.canManage) && (
          <View style={[styles.managementPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.managementTitle, { color: colors.textPrimary }]}>Tournament management</Text>
            <Text style={[styles.managementHint, { color: colors.textSecondary }]}>Current stage: {(tournament.lifecycleStatus ?? "").replace(/_/g, " ").toLowerCase()}</Text>
            {!["IN_PROGRESS", "COMPLETED", "CANCELLED", "ARCHIVED"].includes(tournament.lifecycleStatus ?? "") && (
              <Pressable accessibilityRole="button" onPress={openSettings} style={[styles.settingsButton, { borderColor: colors.primary }]}>
                <Text style={[styles.settingsButtonText, { color: colors.primary }]}>Edit tournament settings</Text>
              </Pressable>
            )}
            {([
              ...(tournament.lifecycleStatus === "DRAFT" ? [{ action: "open-registration", label: "Open registration" }] : []),
              ...(tournament.lifecycleStatus === "REGISTRATION_OPEN" ? [{ action: "close-registration", label: "Close registration" }] : []),
              ...(tournament.lifecycleStatus === "REGISTRATION_CLOSED" ? [{ action: "generate-fixtures", label: "Generate fixtures" }] : []),
              ...(tournament.lifecycleStatus === "READY" ? [{ action: "start", label: "Start tournament" }] : []),
              ...(tournament.lifecycleStatus === "IN_PROGRESS" ? [{ action: "advance-round", label: "Advance round" }, { action: "complete", label: "Complete tournament" }] : []),
            ]).map(({ action, label }) => (
              <Pressable key={action} accessibilityRole="button" disabled={lifecycleMutation.isPending} onPress={() => Alert.alert(label, `Are you sure you want to ${label.toLowerCase()}?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Continue", onPress: () => lifecycleMutation.mutate(action as "open-registration" | "close-registration" | "generate-fixtures" | "start" | "advance-round" | "complete", {
                  onSuccess: (result) => Alert.alert("Tournament updated", result.message),
                  onError: (error) => Alert.alert("Action failed", error instanceof Error ? error.message : "Please try again."),
                }) },
              ])} style={[styles.managementButton, { backgroundColor: colors.primary, opacity: lifecycleMutation.isPending ? 0.55 : 1 }]}>
                {lifecycleMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.managementButtonText}>{label}</Text>}
              </Pressable>
            ))}
          </View>
        )}

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
      <Modal visible={settingsVisible} animationType="slide" onRequestClose={() => setSettingsVisible(false)}>
        <SafeAreaView style={[styles.settingsScreen, { backgroundColor: colors.background }]}>
          <KeyboardAvoidingView style={styles.settingsScreen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={[styles.settingsHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.managementTitle, { color: colors.textPrimary }]}>Tournament settings</Text>
              <Pressable onPress={() => setSettingsVisible(false)}><Text style={{ color: colors.primary, fontWeight: "700" }}>Close</Text></Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.settingsContent} keyboardShouldPersistTaps="handled">
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Tournament name</Text>
              <TextInput value={settingsForm.name} onChangeText={(value) => setSettingsForm((p) => ({ ...p, name: value }))} style={[styles.settingsInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} />
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput value={settingsForm.description} onChangeText={(value) => setSettingsForm((p) => ({ ...p, description: value }))} multiline style={[styles.settingsInput, styles.settingsMultiline, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} />
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Maximum participants</Text>
              <TextInput value={settingsForm.maxParticipants} onChangeText={(value) => setSettingsForm((p) => ({ ...p, maxParticipants: value }))} keyboardType="number-pad" style={[styles.settingsInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} />
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Points (win / draw / loss)</Text>
              <View style={styles.settingsRow}>
                {(["pointsForWin", "pointsForDraw", "pointsForLoss"] as const).map((key) => <TextInput key={key} accessibilityLabel={key} value={settingsForm[key]} onChangeText={(value) => setSettingsForm((p) => ({ ...p, [key]: value }))} keyboardType="number-pad" style={[styles.settingsInput, styles.settingsPointInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} />)}
              </View>
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>League format</Text>
              <View style={styles.settingsRow}>
                {([{ label: "Single round-robin", value: "single" }, { label: "Double round-robin", value: "double" }] as const).map((option) => <Pressable key={option.value} onPress={() => setSettingsForm((p) => ({ ...p, rounds: option.value }))} style={[styles.settingsChoice, { borderColor: settingsForm.rounds === option.value ? colors.primary : colors.border, backgroundColor: settingsForm.rounds === option.value ? colors.primary : colors.surface }]}><Text style={{ color: settingsForm.rounds === option.value ? "#fff" : colors.textPrimary, fontWeight: "600" }}>{option.label}</Text></Pressable>)}
              </View>
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Registration mode</Text>
              <View style={styles.settingsRow}>
                {([{ label: "Open", value: "OPEN" }, { label: "Approval", value: "APPROVAL" }, { label: "Invite only", value: "INVITE_ONLY" }] as const).map((option) => <Pressable key={option.value} onPress={() => setSettingsForm((p) => ({ ...p, registrationMode: option.value }))} style={[styles.settingsChoice, { borderColor: settingsForm.registrationMode === option.value ? colors.primary : colors.border, backgroundColor: settingsForm.registrationMode === option.value ? colors.primary : colors.surface }]}><Text style={{ color: settingsForm.registrationMode === option.value ? "#fff" : colors.textPrimary, fontWeight: "600" }}>{option.label}</Text></Pressable>)}
              </View>
              {([
                ["Registration opens (YYYY-MM-DD)", "registrationOpensAt"],
                ["Registration closes (YYYY-MM-DD)", "registrationClosesAt"],
                ["Tournament starts (YYYY-MM-DD)", "startsAt"],
                ["Tournament ends (YYYY-MM-DD)", "endsAt"],
              ] as const).map(([label, key]) => <View key={key}><Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>{label}</Text><TextInput value={settingsForm[key]} onChangeText={(value) => setSettingsForm((p) => ({ ...p, [key]: value }))} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} autoCapitalize="none" style={[styles.settingsInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} /></View>)}
              <Text style={[styles.settingsFootnote, { color: colors.textSecondary }]}>Format, scoring, capacity, and registration settings are locked after fixtures are generated.</Text>
              <Pressable disabled={settingsMutation.isPending} onPress={saveSettings} style={[styles.managementButton, { backgroundColor: colors.primary, opacity: settingsMutation.isPending ? 0.6 : 1 }]}>{settingsMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.managementButtonText}>Save settings</Text>}</Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
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
  centeredContent: {
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
  managementPanel: { borderWidth: 1, padding: 14, gap: 10 },
  managementTitle: { fontSize: 15, fontWeight: "800" },
  managementHint: { fontSize: 12, textTransform: "capitalize" },
  managementButton: { minHeight: 44, justifyContent: "center", alignItems: "center", paddingHorizontal: 14 },
  managementButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  settingsButton: { minHeight: 42, borderWidth: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 12 },
  settingsButtonText: { fontSize: 13, fontWeight: "700" },
  settingsScreen: { flex: 1 },
  settingsHeader: { minHeight: 58, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth },
  settingsContent: { padding: 18, gap: 8, paddingBottom: 40 },
  settingsLabel: { fontSize: 12, fontWeight: "700", marginTop: 8 },
  settingsInput: { minHeight: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  settingsMultiline: { minHeight: 76, textAlignVertical: "top" },
  settingsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  settingsPointInput: { flex: 1, minWidth: 64 },
  settingsChoice: { minHeight: 40, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, justifyContent: "center" },
  settingsFootnote: { fontSize: 12, lineHeight: 18, marginVertical: 8 },
});
