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

  const progress = max > 0 ? Math.min(current / max, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Participants
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {current}/{max}
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surfaceLight }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: colors.primary,
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
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
