import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus, TournamentType } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentStatusBadge from "./TournamentStatusBadge";

interface TournamentHeaderProps {
  name: string;
  type?: TournamentType;
  status: TournamentStatus;
}

function formatTournamentType(type?: TournamentType) {
  switch (type) {
    case "league":
      return "League";
    case "knockout":
      return "Knockout";
    case "group_stage":
      return "Group Stage";
    case "hybrid":
      return "Hybrid";
    default:
      return null;
  }
}

export default function TournamentHeader({
  name,
  type,
  status,
}: TournamentHeaderProps) {
  const { colors } = useTheme();
  const typeLabel = formatTournamentType(type);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text
          style={[styles.name, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <TournamentStatusBadge status={status} />
      </View>

      {typeLabel ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {typeLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
  },
  meta: {
    fontSize: 13,
  },
});
