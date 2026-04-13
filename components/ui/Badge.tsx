import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type PillBadgeProps = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  compact?: boolean;
};

export function PillBadge({
  label,
  backgroundColor,
  textColor,
  compact = true,
}: PillBadgeProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? colors.surfaceLight,
          paddingHorizontal: compact ? 8 : 10,
          height: compact ? 22 : 26,
          borderRadius: compact ? 11 : 13,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor ?? colors.textSecondary,
            fontSize: compact ? 11 : 12,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
  },
});
