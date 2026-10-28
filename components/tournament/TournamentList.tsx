import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import type { TournamentSummary } from "@/types/tournament";
import { useTheme } from "@/theme/ThemeProvider";
import { StatePanel } from "@/components/ui/StatePanel";
import TournamentRow from "./Tournamentrow";

interface TournamentListProps {
  tournaments: TournamentSummary[];
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSelect: (tournament: TournamentSummary) => void;
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
    return <StatePanel variant="loading" title="Loading tournaments" />;
  }

  if (error) {
    return (
      <StatePanel
        variant="error"
        title="Couldn’t load tournaments"
        message="Check your connection and try again."
        actionLabel="Try again"
        onAction={onRefresh}
      />
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
        <TournamentRow tournament={item} onView={() => onSelect(item)} />
      )}
      ListEmptyComponent={
        <StatePanel
          variant="empty"
          title="No tournaments yet"
          message="When tournaments become available, they’ll appear here."
          compact
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
    gap: 12,
  },
});
