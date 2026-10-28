import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus, TournamentType } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Trophy } from "lucide-react-native";
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
      return "Tournament";
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
      <View style={styles.identityRow}>
        <View style={[styles.iconTile, { backgroundColor: colors.accent + "20" }]}>
          <Trophy size={20} color={colors.accent} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>
            {typeLabel.toUpperCase()}
          </Text>
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
        <TournamentStatusBadge status={status} />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    gap: 13,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  name: {
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.25,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
