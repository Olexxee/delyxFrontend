import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  groupName: string;
  tournamentName?: string;
};

export function FeedCardHeader({ groupName, tournamentName }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.group, { color: colors.textPrimary }]}>
        {groupName}
      </Text>

      {tournamentName && (
        <Text style={[styles.tournament, { color: colors.textSecondary }]}>
          {tournamentName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%", // ensure full width
    alignItems: "center", // horizontal alignment
    marginBottom: 10,
  },
  group: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center", // center text
  },
  tournament: {
    fontSize: 11,
    textAlign: "center", // center text
  },
});
