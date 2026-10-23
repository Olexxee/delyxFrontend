import { getTournamentStatistics } from "@/api/tournamentApi";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function TournamentStatisticsTab({ tournament }: { tournament: TournamentDetail }) {
  const { colors } = useTheme();
  const { data: statistics = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tournamentStatistics", tournament.groupId, tournament.id],
    queryFn: () => getTournamentStatistics(tournament.groupId, tournament.id),
    enabled: Boolean(tournament.groupId && tournament.id),
  });

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 32, alignItems: "center", gap: 10 }}>
        <ActivityIndicator color={colors.accent} />
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Loading tournament statistics…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingVertical: 18, gap: 8 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>Statistics unavailable</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          {error instanceof Error ? error.message : "Could not load this tournament's statistics."}
        </Text>
        <Text onPress={() => refetch()} style={{ color: colors.accent, fontSize: 13, fontWeight: "700" }}>Try again</Text>
      </View>
    );
  }

  if (!statistics.length) {
    return (
      <View style={{ paddingVertical: 28, alignItems: "center", borderTopWidth: 0.5, borderTopColor: colors.border }}>
        <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>No statistics yet</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19, marginTop: 6, maxWidth: 280 }}>
          Player statistics appear after match results have been reviewed and verified by a group administrator.
        </Text>
      </View>
    );
  }

  const number = (value: number) => Number.isFinite(value) ? value.toLocaleString() : "—";
  const percent = (value: number) => `${Math.round((value <= 1 ? value * 100 : value) * 10) / 10}%`;
  const playerName = (playerId: string) =>
    tournament.participants.find((participant) => participant.userId === playerId || participant.id === playerId)?.username
      ?? `Player ${playerId.slice(0, 6)}`;

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
        These figures belong to this tournament only and update from verified match results.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: 690, borderTopWidth: 0.5, borderTopColor: colors.border }}>
          <View style={{ flexDirection: "row", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            {[
              ["Player", 150, "left"],
              ["P", 40, "center"],
              ["W-D-L", 70, "center"],
              ["GF-GA", 75, "center"],
              ["GD", 55, "center"],
              ["Pts", 50, "center"],
              ["Win %", 70, "center"],
              ["Clean sheets", 95, "center"],
            ].map(([label, width, align]) => (
              <Text key={String(label)} style={{ width: Number(width), color: colors.textSecondary, fontSize: 10, fontWeight: "800", textAlign: align as "left" | "center", textTransform: "uppercase", letterSpacing: 0.3 }}>
                {label}
              </Text>
            ))}
          </View>
          {statistics.map((row) => (
            <View key={row.playerId} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
              <Text numberOfLines={1} style={{ width: 150, color: colors.textPrimary, fontSize: 12, fontWeight: "700", paddingRight: 8 }}>
                {playerName(row.playerId)}
              </Text>
              <Text style={{ width: 40, color: colors.textSecondary, fontSize: 12, textAlign: "center" }}>{number(row.matchesPlayed)}</Text>
              <Text style={{ width: 70, color: colors.textSecondary, fontSize: 12, textAlign: "center" }}>{number(row.wins)}-{number(row.draws)}-{number(row.losses)}</Text>
              <Text style={{ width: 75, color: colors.textSecondary, fontSize: 12, textAlign: "center" }}>{number(row.goalsFor)}-{number(row.goalsAgainst)}</Text>
              <Text style={{ width: 55, color: row.goalDifference > 0 ? "#22c55e" : row.goalDifference < 0 ? "#ef4444" : colors.textSecondary, fontSize: 12, textAlign: "center", fontWeight: "700" }}>
                {row.goalDifference > 0 ? "+" : ""}{number(row.goalDifference)}
              </Text>
              <Text style={{ width: 50, color: colors.textPrimary, fontSize: 12, textAlign: "center", fontWeight: "800" }}>{number(row.points)}</Text>
              <Text style={{ width: 70, color: colors.textSecondary, fontSize: 12, textAlign: "center" }}>{percent(row.winRate)}</Text>
              <Text style={{ width: 95, color: colors.textSecondary, fontSize: 12, textAlign: "center" }}>{number(row.cleanSheets)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
