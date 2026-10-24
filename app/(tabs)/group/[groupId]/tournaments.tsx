import { useGroupShell } from "@/authContext/GroupShellContext";
import { CreateTournamentSheet } from "@/components/tournament/CreateTournamentSheet";
import { useGroupTournaments } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { ApiTournament } from "@/types/tournament";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus, Trophy, Users, CalendarDays, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function GroupTournamentsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { shell } = useGroupShell();
  const [createVisible, setCreateVisible] = useState(false);
  const {
    data: tournaments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGroupTournaments(groupId);

  const canCreate = shell.permissions.canCreateTournament;

  const openTournament = (tournamentId: string) => {
    router.push({
      pathname: "/(tabs)/tournaments/[tournamentId]",
      params: { tournamentId },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 21, fontWeight: "800", letterSpacing: -0.4 }}>
              Tournaments
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 5, lineHeight: 19 }}>
              Browse competitions, follow progress, and open a tournament for its fixtures, standings, and results.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Refresh tournaments"
            onPress={() => refetch()}
            style={{ padding: 10 }}
          >
            <RefreshCw size={17} color={colors.textSecondary} />
          </Pressable>
        </View>

        {canCreate && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setCreateVisible(true)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              backgroundColor: pressed ? colors.primary : colors.accent,
              paddingHorizontal: 16,
              paddingVertical: 13,
              marginTop: 16,
              marginBottom: 24,
            })}
          >
            <Plus size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              Create tournament
            </Text>
          </Pressable>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
            ALL TOURNAMENTS
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {tournaments.length}
          </Text>
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: "center", gap: 10 }}>
            <ActivityIndicator color={colors.accent} />
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Loading tournaments…</Text>
          </View>
        ) : isError ? (
          <View style={{ paddingVertical: 20, borderTopWidth: 0.5, borderTopColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>
              Could not load tournaments
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 19 }}>
              {error instanceof Error ? error.message : "Please try again."}
            </Text>
            <Pressable onPress={() => refetch()} style={{ alignSelf: "flex-start", paddingVertical: 12 }}>
              <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 13 }}>Try again</Text>
            </Pressable>
          </View>
        ) : tournaments.length === 0 ? (
          <View style={{ borderTopWidth: 0.5, borderTopColor: colors.border, paddingVertical: 28, alignItems: "center" }}>
            <Trophy size={30} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700", marginTop: 12 }}>
              No tournaments yet
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19, marginTop: 6, maxWidth: 280 }}>
              {canCreate
                ? "Create the first tournament for this group."
                : "A group administrator can create the first tournament here."}
            </Text>
          </View>
        ) : (
          <View style={{ borderTopWidth: 0.5, borderTopColor: colors.border }}>
            {tournaments.map((tournament) => (
              <Pressable
                key={tournament.id}
                onPress={() => openTournament(tournament.id)}
                style={({ pressed }) => ({
                  paddingVertical: 16,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                  backgroundColor: pressed ? colors.surface : "transparent",
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent + "1A" }}>
                    <Trophy size={19} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }} numberOfLines={2}>
                      {tournament.name}
                    </Text>
                    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", marginTop: 4 }}>
                      {statusLabel(tournament.status)} · {statusLabel(tournament.type)}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 14, marginTop: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Users size={13} color={colors.textSecondary} />
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {tournament.participantCount}/{tournament.maxParticipants || "—"} players
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <CalendarDays size={13} color={colors.textSecondary} />
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {tournament.currentMatchday && tournament.totalMatchdays
                            ? `Matchday ${tournament.currentMatchday}/${tournament.totalMatchdays}`
                            : new Date(tournament.startDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 20 }}>›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {isFetching && !isLoading && (
          <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: "center", marginTop: 12 }}>
            Updating…
          </Text>
        )}
      </ScrollView>

      <CreateTournamentSheet
        visible={createVisible}
        groupId={groupId}
        onClose={() => setCreateVisible(false)}
        onCreated={(tournament: ApiTournament) => {
          setCreateVisible(false);
          const id = tournament.id ?? tournament._id;
          if (id) openTournament(id);
        }}
      />
    </View>
  );
}
