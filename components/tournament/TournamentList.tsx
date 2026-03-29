import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentSummary } from "@/types/tournament";
import { Trophy } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TournamentRow from "./Tournamentrow";

interface TournamentListProps {
  tournaments: TournamentSummary[];
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSelect: (tournament: TournamentSummary) => void;
}

function TournamentEmpty() {
  const { colors } = useTheme();

  return (
    <View style={styles.empty}>
      <Trophy size={40} color={colors.border} strokeWidth={1.5} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No tournaments yet.
      </Text>
    </View>
  );
}

export function TournamentList({
  tournaments,
  loading,
  error,
  refreshing,
  onRefresh,
  onSelect,
}: TournamentListProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Failed to load tournaments.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tournaments}
      keyExtractor={(tournament) => tournament.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
      renderItem={({ item }) => (
        <TournamentRow
          tournament={item}
          onView={() => onSelect(item)}
        />
      )}
      ListEmptyComponent={<TournamentEmpty />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },

  errorText: {
    fontSize: 14,
    textAlign: "center",
  },

  list: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});