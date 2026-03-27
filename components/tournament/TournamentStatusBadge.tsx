import { useTheme } from "@/theme/ThemeProvider";
import { STATUS_META, type TournamentStatus } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  status: TournamentStatus;
  showDot?: boolean;
}

export default function TournamentStatusBadge({
  status,
  showDot = true,
}: Props) {
  const { colors } = useTheme();
  const meta = STATUS_META[status];

  const toneColor =
    meta.tone === "primary"
      ? colors.primary
      : meta.tone === "warning"
        ? colors.warning
        : meta.tone === "accent"
          ? colors.accent
          : colors.status;

  const isOngoing = status === "ongoing";

  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: toneColor,
          backgroundColor: `${toneColor}18`,
        },
      ]}
    >
      {isOngoing && showDot ? (
        <View style={[styles.dot, { backgroundColor: toneColor }]} />
      ) : null}

      <Text style={[styles.label, { color: toneColor }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});