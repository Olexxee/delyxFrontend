import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type UnreadBadgeProps = {
  count: number;
};

export function UnreadBadge({ count }: UnreadBadgeProps) {
  const { colors } = useTheme();

  if (count <= 0) return null;

  const displayValue = count > 99 ? "99+" : String(count);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.text}>{displayValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
