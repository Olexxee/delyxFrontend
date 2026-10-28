import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { radius, spacing } from "@/theme";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "accent";

type PillBadgeProps = {
  label: string;
  variant?: BadgeVariant;
  backgroundColor?: string;
  textColor?: string;
  compact?: boolean;
};

export function PillBadge({
  label,
  variant = "neutral",
  backgroundColor,
  textColor,
  compact = true,
}: PillBadgeProps) {
  const { colors } = useTheme();

  const variantColors = {
    neutral: { background: colors.surfaceLight, text: colors.textSecondary, border: colors.border },
    primary: { background: colors.primary, text: "#FFFFFF", border: colors.primary },
    success: { background: colors.surfaceLight, text: colors.accent, border: colors.accent },
    warning: { background: colors.surfaceLight, text: colors.warning, border: colors.warning },
    danger: { background: colors.surfaceLight, text: colors.danger, border: colors.danger },
    accent: { background: colors.surfaceLight, text: colors.accent, border: colors.accent },
  } satisfies Record<BadgeVariant, { background: string; text: string; border: string }>;

  const resolved = variantColors[variant];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? resolved.background,
          borderColor: resolved.border,
          paddingHorizontal: compact ? spacing.sm : spacing.md,
          minHeight: compact ? 24 : 30,
          borderRadius: compact ? radius.full : radius.md,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor ?? resolved.text,
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
    borderWidth: 1,
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.15,
  },
});
