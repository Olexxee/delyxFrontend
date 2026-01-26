import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
}

export function HeaderTitle({ title, subtitle }: HeaderTitleProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.textContainer}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 2 },
});
