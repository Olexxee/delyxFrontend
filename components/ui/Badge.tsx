import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeProps = {
  label: string;
  type?: "rank" | "medal" | "status";
  color?: string;
  size?: number;
};

export function Badge({
  label,
  type = "status",
  color,
  size = 16,
}: BadgeProps) {
  const { colors } = useTheme();

  const backgroundColor =
    color ||
    (type === "rank"
      ? colors.primary
      : type === "medal"
        ? colors.accent
        : colors.warning);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          minWidth: size * 2,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size / 2 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
