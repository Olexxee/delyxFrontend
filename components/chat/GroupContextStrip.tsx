import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupContextStripVM } from "@/view-models/chat.vm";

type Props = {
  vm: GroupContextStripVM;
  onPress?: (tournamentId: string) => void;
};

export function GroupContextStrip({ vm, onPress }: Props) {
  const { colors } = useTheme();

  if (!vm.visible || !vm.tournamentId) return null;

  return (
    <Pressable
      onPress={() => onPress?.(vm.tournamentId!)}
      style={[styles.container, { backgroundColor: colors.surfaceLight }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {vm.tournamentName}
        </Text>

        {vm.tournamentStatus ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {vm.tournamentStatus}
          </Text>
        ) : null}
      </View>

      {vm.ctaLabel ? (
        <Text style={{ color: colors.primary, fontWeight: "600" }}>
          {vm.ctaLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});
