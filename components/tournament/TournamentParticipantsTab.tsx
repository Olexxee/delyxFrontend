import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TournamentParticipantsProps {
  current: number;
  max: number;
}

export default function TournamentParticipants({
  current,
  max,
}: TournamentParticipantsProps) {
  const { colors } = useTheme();
  const safeCurrent = Math.max(0, current);
  const progress = max > 0 ? Math.min(safeCurrent / max, 1) : 0;
  const remaining = Math.max(0, max - safeCurrent);
  const nearlyFull = max > 0 && remaining > 0 && remaining <= Math.max(3, Math.ceil(max * 0.15));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelBlock}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Player slots
          </Text>
          <Text style={[styles.helper, { color: colors.textSecondary }]}>
            {max > 0
              ? remaining === 0
                ? "Tournament full"
                : `${remaining} ${remaining === 1 ? "spot" : "spots"} remaining`
              : "Open registration"}
          </Text>
        </View>
        <Text style={[styles.value, { color: nearlyFull ? colors.warning : colors.textPrimary }]}>
          {safeCurrent}{max > 0 ? ` / ${max}` : ""}
        </Text>
      </View>

      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Tournament participant capacity"
        accessibilityValue={{ min: 0, max: max > 0 ? max : 100, now: max > 0 ? Math.min(safeCurrent, max) : 0 }}
        style={[styles.track, { backgroundColor: colors.surfaceLight }]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: nearlyFull ? colors.warning : colors.accent,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 9,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  labelBlock: {
    gap: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  helper: {
    fontSize: 11,
  },
  value: {
    fontSize: 13,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  track: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
