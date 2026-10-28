import React, { type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

export type AppCardProps = {
  children: ReactNode;
  variant?: "default" | "raised" | "outlined";
  padding?: keyof typeof spacing;
  radiusSize?: keyof typeof radius;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function AppCard({
  children,
  variant = "default",
  padding = "lg",
  radiusSize = "lg",
  style,
  accessibilityLabel,
}: AppCardProps) {
  const { colors } = useTheme();
  const surface = variant === "raised" ? colors.surfaceLight : colors.surface;
  const borderColor = variant === "outlined" ? colors.borderLight : colors.border;

  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        {
          backgroundColor: surface,
          borderColor,
          borderRadius: radius[radiusSize],
          padding: spacing[padding],
          borderWidth: variant === "outlined" ? 1.5 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
